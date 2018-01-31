import { Observer } from './observer';
import { parseExpression } from './../utilities';

export function Mvvm(model) {
    this.model = model || {};
    this.observer = new Observer(model);
}

Mvvm.prototype.bindModel = function (expression) {
    let model = this.model;
    let value = parseExpression(expression)(this.model);
    return value ? {
        '__bind__': {
            model: model,
        },
        '$expression': expression,
        '$value': value
    } : null;
};
