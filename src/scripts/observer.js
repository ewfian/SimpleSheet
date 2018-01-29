import Depend from './depend';
import {
    isArray,
    isObject,
} from './util';

export function Observer(obj) {
    this.$observe = function (_obj) {
        if (isArray(_obj)) {
            this.$cloneArray(_obj);
        } else if (isObject(_obj)) {
            this.$observeObj(_obj);
        }
    };

    this.$observeObj = function (_obj) {
        for (let prop in _obj) {
            var val = _obj[prop];
            defineProperty(_obj, prop, val);
            if (prop != '__observe__') {
                this.$observe(val);
            }
        }
    };

    this.$cloneArray = function (_array) {
        var arrayPrototype = Array.prototype;
        var newPrototype = Object.create(arrayPrototype);
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(
            method => {
                Object.defineProperty(newPrototype, method, {
                    value: function (newVal) {
                        var dep = _array.__observe__;
                        var re = arrayPrototype[method].apply(_array, arguments);
                        dep.notify();
                        // console.log('arr notify', dep);
                        return re;
                    },
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
            });
        _array.__proto__ = newPrototype;
    };

    this.$observe(obj);
}

var addObserve = function (val) {
    if (!val || !isObject(val)) {
        return;
    }
    var dep = new Depend();
    if (isArray(val)) {
        val.__observe__ = dep;
        return dep;
    }
};

function defineProperty(obj, prop, val) {
    if (prop == '__observe__') {
        return;
    }
    val = val || obj[prop];
    var dep = new Depend();
    obj.__observe__ = dep;

    var childDep = addObserve(val);

    Object.defineProperty(obj, prop, {
        get: function () {
            var target = Depend.target;
            if (target) {
                dep.addSub(target);
                if (childDep) {
                    childDep.addSub(target);
                }
            }
            return val;
        },
        set: function (newVal) {
            if (newVal != val) {
                val = newVal;
                dep.notify();
                // console.log('obj notify', dep);
            }
        }
    });
}
