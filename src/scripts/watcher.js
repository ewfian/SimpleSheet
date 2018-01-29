import Depend from './depend';

function Watcher(model, expression, update) {
    this.model = model;
    this.expression = expression;
    this.update = update;
    this.getter = getValue(expression);

    Depend.target = this;
    this.value = this.getter(model);
    Depend.target = null;
    console.log('watch constr');
}

Watcher.prototype.run = function () {
    var oldValue = this.value;
    var newValue = this.getter(this.model);
    this.update(newValue, oldValue);
};


let getValue = function (exp) {
    let exps = exp.split('.');
    return function (obj) {
        exps.forEach(key => {
            obj = obj[key.trim()];
        });
        return obj;
    };
};


export default Watcher;
