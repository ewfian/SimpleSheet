import { Depend } from './depend';
import { isArray, isObject } from './../utilities';

export function Observer(obj) {
    this.$observe = function (_obj) {
        if (isArray(_obj)) {
            this.$observeArray(_obj);
            _obj.__ob__ = this;
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

    this.$observeArrayItem = function (_array) {
        for (let i = 0, l = _array.length; i < l; i++) {
            this.$observeObj(_array[i]);
        }
    };

    this.$observeArray = function (_array) {
        var arrayPrototype = Array.prototype;
        var newPrototype = Object.create(arrayPrototype);
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(
            method => {
                Object.defineProperty(newPrototype, method, {
                    value: function (newVal) {
                        var dep = _array.__observe__;
                        var re = arrayPrototype[method].apply(_array, arguments);

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
                        if (inserted) _array.__ob__.$observeArrayItem(inserted);
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
                console.log('dep.addSub', obj, prop, target.expression);

                if (childDep) {
                    childDep.addSub(target);
                    console.log('childDep.addSub', obj, prop, target.expression);
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
