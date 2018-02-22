import { Depend } from './depend';
import { def, hasProto, protoAugment, copyAugment } from './../utilities';

const arrayProto   = Array.prototype;
const arrayMethods = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(
    method => {
        const original = arrayProto[method];
        def(arrayMethods, method, function () {
            let ob       = this.__ob__;
            let result   = original.apply(this, arguments);
            let inserted = null;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = Array.from(arguments);
                    break;
                case 'splice':
                    inserted = [].slice.call(arguments, 2);
                    break;
            }
            if (inserted) {
                ob._observeArray(inserted);
            }
            ob.dep.notify(method, arguments);
            return result;
        });
    });
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export function Observer(model) {
    this.model = model;
    this.dep   = new Depend();

    this._observeArray = function (items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    };
    this.__ob__        = null;
    def(model, '__ob__', this);

    if (Array.isArray(model)) {
        let augment = hasProto ? protoAugment : copyAugment;
        augment(model, arrayMethods, arrayKeys);
        this._observeArray(model);
    } else {
        walk(model);
    }
}

function walk(obj) {
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key]);
    });
}

function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    let ob;
    if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else {
        ob = new Observer(value);
    }
    return ob;
}

function defineReactive(obj, key, val) {
    let dep     = new Depend();
    let childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable  : true,
        configurable: true,
        get         : function () {
            let target = Depend.target;
            if (target) {
                dep.addSub(target);
                if (childOb) {
                    childOb.dep.addSub(target);
                }
            }
            return val;
        },
        set         : function (newVal) {
            //[newVal !== newVal && val !== val] to trigger change on NaN->NaN set
            if (val === newVal || (newVal !== newVal && val !== val)) {
                return;
            }
            val     = newVal;
            childOb = observe(newVal);
            dep.notify();
        }
    });
}
