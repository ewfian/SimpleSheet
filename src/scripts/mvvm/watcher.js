import { Depend } from './depend';
import { parseExpression, deepCopyBoundProps } from './../utilities';

export function Watcher(model, expression, update) {
    this.watcher_id = (Math.random() + 1).toString(36).substring(2);

    this.model      = model;
    this.expression = expression;
    this.update     = update;
    this.getter     = parseExpression(expression);

    Depend.target = this;
    this.value    = deepCopyBoundProps(this.getter(model));
    Depend.target = null;
}

Watcher.prototype.run = function (op, args) {
    let oldValue = this.value;
    let newValue = this.value = deepCopyBoundProps(this.getter(this.model));
    this.update(newValue, oldValue, op, args);
};
