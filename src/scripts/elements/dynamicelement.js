import { inherits, isObject, getPixelValue, setAttr } from './../utilities';
import { Element } from './element';
import { Watcher } from './../mvvm';

export function DynamicElement(tagName, props, children) {
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
            model: children.__bind__.model,
            expression: children.expression,
            update: function (newValue, oldValue) {
                let value = typeof newValue === 'undefined' ? '' : newValue;
                this.textContent = value;
            }
        });
        this.children = [].concat(children.value || []);
    }
}

inherits(DynamicElement, Element);

DynamicElement.prototype.render = function () {
    let el = this.__proto__.__proto__.render.call(this);
    el._watchers = [];
    this.watchers.forEach(w => el._watchers.push(new Watcher(w.model, w.expression, w.update.bind(el))));
    return el;
};

function parseBind(key, value) {
    switch (key) {
        case 'style':
            for (let st in value) {
                if (value.hasOwnProperty(st)) {
                    let styleValue = value[st];
                    if (styleValue.hasOwnProperty('__bind__')) {
                        value[st] = styleValue.value;
                        this.watchers.push({
                            model: styleValue.__bind__.model,
                            expression: styleValue.expression,
                            update: function (newValue, oldValue) {
                                let value = typeof newValue === 'undefined' ? '' : newValue;
                                this.style[st] = getPixelValue(st, value);
                            }
                        });
                    }
                }
            }
            break;
        case 'value':
            var tagName = this.tagName || '';
            tagName = tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                if (value.hasOwnProperty('__bind__')) {
                    this.props.value = value.value;
                    this.watchers.push({
                        model: value.__bind__.model,
                        expression: value.expression,
                        update: function (newValue, oldValue) {
                            let value = typeof newValue === 'undefined' ? '' : newValue;
                            this.value = value;
                        }
                    });
                }
            }
            break;
        default:
            if (value.hasOwnProperty('__bind__')) {
                this.props[key] = value.value;
                this.watchers.push({
                    model: value.__bind__.model,
                    expression: value.expression,
                    update: function (newValue, oldValue) {
                        let value = typeof newValue === 'undefined' ? '' : newValue;
                        setAttr(this, key, value);
                    }
                });
            }
            break;
    }
}
