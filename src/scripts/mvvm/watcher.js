import { Depend } from './depend';
import { parseExpression } from './../utilities';

export function Watcher(model, expression, update) {
    this.model = model;
    this.expression = expression;
    this.update = update;
    this.getter = parseExpression(expression);

    Depend.target = this;
    this.value = this.getter(model);
    Depend.target = null;
}

Watcher.prototype.run = function () {
    var oldValue = this.value;
    var newValue = this.value = this.getter(this.model);
    this.update(newValue, oldValue);
};
