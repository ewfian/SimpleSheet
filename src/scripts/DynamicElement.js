import { inherits, isObject, getPixelValue } from './utilities';
import Element from './element';
import { Watcher } from './mvvm';

export default function DynamicElement(tagName, props, children) {
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
            console.log('Not Implement');
            // var tagName = node.tagName || '';
            // tagName = tagName.toLowerCase();
            // if (tagName === 'input' || tagName === 'textarea') {
            //     node.value = value;
            // } else {
            //     node.setAttribute(key, value);
            // }
            break;
        default:
            console.log('Not Implement');
            break;
    }

}
