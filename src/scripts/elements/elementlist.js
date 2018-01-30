import { Watcher } from './../mvvm';
import { isArray } from '../utilities/index';
import { DynamicElement } from './DynamicElement';

export function ElementList(tagName, props, bindModel) {
    this.tagName = tagName;
    this.props = props;
    this.bindModel = bindModel;
    this.model_array = bindModel.value;
    this.elements = [];
    this.watchers = [];

    if (isArray(this.bindModel.value)) {
        this.model_array.forEach(model => {
            this.elements.push(new DynamicElement(this.tagName, this.props, model));
        });
    }

    this.watchers.push({
        model: this.bindModel.__bind__.model,
        expression: this.bindModel.expression,
        update: function (newValue, oldValue) {
            let value = typeof newValue === 'undefined' ? '' : newValue;
            this.innerHTML = '';
            value.forEach(m => {
                this.appendChild(new DynamicElement('div', this._props, m).render());
            });
        }
    });
}

ElementList.prototype.render = function () {
    let el = new DynamicElement('div', { class: 'ruler-cells' }, this.elements).render();
    el._props = this.props;
    this.watchers.forEach(w => el._watchers.push(new Watcher(w.model, w.expression, w.update.bind(el))));
    return el;
};
