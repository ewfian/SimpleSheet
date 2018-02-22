import { inherits, isObject, getPixelValue, setAttr } from './../utilities';
import { Element } from './element';
import { Watcher } from './../mvvm';

export function DynamicElement(tagName, props = {}, children = []) {
    Element.call(this, tagName, props, children);
    this.watchers = [];

    if (isObject(props)) {
        for (let propName in props) {
            if (props.hasOwnProperty(propName)) {
                let propValue = props[propName];
                parseBind.call(this, propName, propValue);
            }
        }
    }

    if (isObject(children) && children.hasOwnProperty('__bind__')) {
        this.watchers.push({
            model     : children.__bind__.model,
            expression: children.$expression,
            update    : function (newValue, oldValue) {
                let value        = typeof newValue === 'undefined' ? '' : newValue;
                this.textContent = value;
            }
        });
        this.children = [].concat(children.$value);
    }
}

inherits(DynamicElement, Element);

DynamicElement.prototype.render = function (root) {
    let el       = this.__proto__.__proto__.render.call(this, root);
    el._watchers = [];
    this.watchers.forEach(w => el._watchers.push(new Watcher(w.model, w.expression, w.update.bind(el))));
    return el;
};

function parseBind(bindKey, bindValue) {
    switch (bindKey) {
        case 'style':
            for (let st in bindValue) {
                if (bindValue.hasOwnProperty(st)) {
                    let styleValue = bindValue[st];
                    if (styleValue.hasOwnProperty('__bind__')) {
                        bindValue[st] = styleValue.$value;
                        this.watchers.push({
                            model     : styleValue.__bind__.model,
                            expression: styleValue.$expression,
                            update    : function (newValue) {
                                let value      = typeof newValue === 'undefined' ? '' : newValue;
                                this.style[st] = getPixelValue(st, value);
                            }
                        });
                    }
                }
            }
            break;
        default:
            if (bindValue.hasOwnProperty('__bind__')) {
                this.props[bindKey] = bindValue.$value;
                this.watchers.push({
                    model     : bindValue.__bind__.model,
                    expression: bindValue.$expression,
                    update    : function (newValue) {
                        let value = typeof newValue === 'undefined' ? '' : newValue;
                        setAttr(this, bindKey, value);
                    }
                });
            }
    }
}
