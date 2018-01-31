import { Watcher } from './../mvvm';
import { isArray, isObject } from '../utilities/index';
import { DynamicElement } from './DynamicElement';
import { parseExpression } from './../utilities';

export function ElementList(bindModel, parentProps, props, parentTagName = 'div', tagName = 'div') {
    if (!isArray(bindModel.$value)) {
        throw 'InvalidArgumentException';
    }
    this.bindModel = bindModel;
    this.parentProps = parentProps;
    this.props = props;
    this.parentTagName = parentTagName;
    this.tagName = tagName;

    this.elements = [];
    this.watchers = [];

    if (isObject(props)) {
        for (let propName in props) {
            if (props.hasOwnProperty(propName)) {
                let propValue = props[propName];
                parseBind.call(this, propName, propValue);
            }
        }
    }

    // bindModel.$value.forEach(model => {
    //     this.elements.push(new DynamicElement(tagName, props, model.text));
    // });

    // this.watchers.push({
    //     model: this.bindModel.__bind__.model,
    //     expression: this.bindModel.$expression,
    //     update: function (newValue, oldValue, op, args) {
    //         switch (op) {
    //             case 'push':
    //                 if (args.length > 0) {
    //                     this.appendChild(new DynamicElement(this.tagName, this._props, args[0].text).render());
    //                 }
    //                 break;
    //             case 'shift':
    //                 if (this.hasChildNodes()) {
    //                     this.firstChild.remove();
    //                 }
    //                 break;
    //             case 'pop':
    //                 if (this.hasChildNodes()) {
    //                     this.lastChild.remove();
    //                 }
    //                 break;
    //             case 'unshift':
    //                 if (args.length > 0) {
    //                     this.insertBefore(new DynamicElement(this.tagName, this._props, args[0].text).render(),
    //                         this.firstChild);
    //                 }
    //                 break;
    //             case 'reverse':
    //                 Array.prototype.slice.call(this.children)
    //                     .map(x => this.removeChild(x))
    //                     .reverse()
    //                     .forEach(x => this.appendChild(x));
    //                 break;
    //             case 'sort':
    //                 var sortFunction = args[0] || ((curr, next) => curr - next);
    //                 Array.prototype.slice.call(this.children)
    //                     .map(x => this.removeChild(x))
    //                     .sort((e1, e2) => sortFunction(e1.firstChild.textContent, e2.firstChild.textContent))
    //                     .forEach(x => this.appendChild(x));
    //                 break;
    //             case 'splice':
    //                 var nodeList = Array.prototype.slice.call(this.children).map(x => this.removeChild(x));
    //                 nodeList.splice(...[].slice.call(args, 0, 2), ...[].slice.call(args, 2).map(e =>
    //                     new DynamicElement(this.tagName, this._props, e.text).render()));
    //                 nodeList.forEach(x => this.appendChild(x));
    //                 break;
    //             default:
    //                 throw 'NotImplementedException';
    //         }
    //     }
    // });
}

function parseBind(bindKey, bindValue) {

    switch (bindKey) {
        case 'style':
            for (let st in bindValue) {
                if (bindValue.hasOwnProperty(st)) {
                    let styleValue = bindValue[st];
                    console.log(st, styleValue);
                }
            }
            break;
        case 'value':
            if (bindValue.hasOwnProperty('__bind__')) {
                console.log('value', bindValue);
            }
            break;
        case 'textContent':
            if (bindValue.hasOwnProperty('__bind__')) {
                console.log('textContent', bindValue);
            }
            break;
        default:
            if (bindValue.hasOwnProperty('__bind__')) {
                console.log('def', bindValue);
            }
            break;
    }
}

ElementList.prototype.render = function () {
    let el = new DynamicElement(this.parentTagName, this.parentProps, this.elements).render();
    el._props = this.props;
    this.watchers.forEach(w => el._watchers.push(new Watcher(w.model, w.expression, w.update.bind(el))));
    return el;
};
