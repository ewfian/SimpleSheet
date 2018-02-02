import { Depend } from './depend';
import { isArray, isObject } from './../utilities';

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
                        dep.notify(method, arguments);
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
    // https://github.com/GoogleChrome/proxy-polyfill/issues/37
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
    // The Object.seal() method seals an object, preventing new properties from being added to it and
    // marking all existing properties as non-configurable. Values of present properties can still be
    // changed as long as they are writable.
    // Objects sealed with Object.seal() can have their existing properties changed.
    obj._proxy = null;
    obj._proxy = new Proxy(obj, handler);
}

var handler = {
    get(target, key) {
        if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], handler);
        } else {
            return target[key];
        }
    },
    set(target, key, value) {
        console.log(target);
        console.log(key);
        console.log(value);
        return true;
    }
};

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
