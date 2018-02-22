import { Observer } from './observer';
import { parseExpression } from './../utilities';

export function Mvvm(model) {
    this.model    = model || {};
    this.observer = new Observer(model);
}

Mvvm.prototype.bindModel = function (expression, model) {
    let _model = model || this.model;
    let value  = parseExpression(expression)(_model);
    return {
        '__bind__'   : {
            model: _model,
        },
        '$expression': expression,
        '$value'     : value
    };
};

Mvvm.prototype.bindItem = function (key, model) {
    let _model = model || this.model;
    return {
        '__bind__': {
            model: _model,
        },
        '$key'    : key,
    };
};
