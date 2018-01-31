import { Watcher } from './../mvvm';
import { isArray } from '../utilities/index';
import { DynamicElement } from './DynamicElement';

export function ElementList(tagName, props, bindModel) {
    this.tagName = tagName;
    this.props = props;
    this.bindModel = bindModel;
    this.elements = [];
    this.watchers = [];

    if (isArray(bindModel.value)) {
        bindModel.value.forEach(model => {
            this.elements.push(new DynamicElement(tagName, props, model));
        });
    }

    this.watchers.push({
        model: this.bindModel.__bind__.model,
        expression: this.bindModel.expression,
        update: function (newValue, oldValue, op, args) {
            switch (op) {
                case 'push':
                    this.appendChild(new DynamicElement('div', this._props, args[0]).render());
                    break;
                case 'shift':
                    if (this.hasChildNodes()) this.firstChild.remove();
                    break;
                case 'pop':
                    if (this.hasChildNodes()) this.lastChild.remove();
                    break;
                case 'unshift':
                    this.insertBefore(new DynamicElement('div', this._props, args[0]).render(), this.firstChild);
                    break;
                case 'reverse':
                    Array.prototype.slice.call(this.children)
                        .map(x => this.removeChild(x))
                        .reverse()
                        .forEach(x => this.appendChild(x));
                    break;
                case 'sort':
                    Array.prototype.slice.call(this.children)
                        .map(x => this.removeChild(x))
                        .sort((e1, e2) => args[0](e1.firstChild.textContent, e2.firstChild.textContent))
                        .forEach(x => this.appendChild(x));
                    break;
                case 'splice':
                    var nodeList = Array.prototype.slice.call(this.children)
                        .map(x => this.removeChild(x));
                    if (args[2]) args[2] = new DynamicElement('div', this._props, args[2]).render();
                    nodeList.splice(...args);
                    nodeList.forEach(x => this.appendChild(x));
                    break;
                default:
                    throw 'NotImplementedException';
            }
        }
    });
}

ElementList.prototype.render = function () {
    let el = new DynamicElement('div', { class: 'ruler-cells' }, this.elements).render();
    el._props = this.props;
    this.watchers.forEach(w => el._watchers.push(new Watcher(w.model, w.expression, w.update.bind(el))));
    return el;
};
