import Depend from './depend';
import {
    isObject
} from './util';

function Watcher(model, expression, update) {
    this.model = model;
    this.expression = expression;
    this.update = update;
    this.getter = getValue(expression);

    Depend.target = this;
    this.value = this.getter(model);
    Depend.target = null;
}

Watcher.prototype.run = function () {
    var oldValue = this.value;
    var newValue = this.value = this.getter(this.model);
    this.update(newValue, oldValue);
};


let getValue = function (exp) {
    let exps = exp.split('.');
    return function (obj) {
        exps.forEach(key => {
            obj = obj[key.trim()];
        });
        return isObject(obj) ? JSON.parse(JSON.stringify(obj, (key, value) =>
            // https://stackoverflow.com/questions/4910567/hide-certain-values-in-output-from-json-stringify
            key == '__observe__' ? undefined : value
        )) : obj;
    };
};


export default Watcher;
