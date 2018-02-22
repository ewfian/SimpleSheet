import { Watcher } from './../mvvm';
import { isObject, updateObjectByPath, deepCopyBoundProps } from '../utilities';
import { DynamicElement } from './dynamicelement';
import { Mvvm } from '../mvvm';

export function ElementList(bindModel, parentProps, props, parentTagName = 'div', tagName = 'div') {
    if (!Array.isArray(bindModel.$value)) {
        throw 'InvalidArgumentException';
    }
    this.bindModel     = bindModel;
    this.parentProps   = parentProps;
    this.props         = props;
    this.parentTagName = parentTagName;
    this.tagName       = tagName;

    this.bindTemplates = [];
    this.elements      = [];
    this.watchers      = [];

    if (isObject(props)) {
        for (let propName in props) {
            if (props.hasOwnProperty(propName)) {
                let propValue = props[propName];
                parseBind.call(this, propName, propValue);
            }
        }
    }

    bindModel.$value.forEach(model => {
        let boundProps = deepCopyBoundProps(props);
        this.bindTemplates.forEach(
            temp => updateObjectByPath(boundProps, Mvvm.prototype.bindModel(temp.key, model), temp.path)
        );
        this.elements.push(new DynamicElement(tagName, boundProps));
    });

    this.watchers.push({
        model     : this.bindModel.__bind__.model,
        expression: this.bindModel.$expression,
        update    : generateUpdateFunction()
    });
}

function generateUpdateFunction() {
    return function (newValue, oldValue, op, args) {
        let insertNode = null;

        if (['push', 'unshift'].indexOf(op) > -1 && args.length > 0) {
            this._bindTemplates.forEach(
                temp => {
                    updateObjectByPath(this._props, Mvvm.prototype.bindModel(temp.key, args[0]), temp.path);
                }
            );
            insertNode = new DynamicElement(this.tagName, this._props).render();
        }
        switch (op) {
            case 'push':
                if (args.length > 0) {
                    this.appendChild(insertNode);
                }
                break;
            case 'shift':
                if (this.hasChildNodes()) {
                    this.firstChild.remove();
                }
                break;
            case 'pop':
                if (this.hasChildNodes()) {
                    this.lastChild.remove();
                }
                break;
            case 'unshift':
                if (args.length > 0) {
                    this.insertBefore(insertNode, this.firstChild);
                }
                break;
            case 'reverse':
                Array.prototype.slice.call(this.children)
                    .map(x => this.removeChild(x))
                    .reverse()
                    .forEach(x => this.appendChild(x));
                break;
            case 'splice':
                var nodeList = Array.prototype.slice.call(this.children).map(x => this.removeChild(x));
                nodeList.splice(...[].slice.call(args, 0, 2), ...[].slice.call(args, 2).map(e => {
                    this._bindTemplates.forEach(
                        temp => updateObjectByPath(this._props, Mvvm.prototype.bindModel(temp.key, e), temp.path)
                    );
                    return new DynamicElement(this.tagName, this._props).render();
                }));
                nodeList.forEach(x => this.appendChild(x));
                break;
            // case 'sort':
            //     var sortFunction = args[0] || ((curr, next) => curr.textContent - next.textContent);
            //     Array.prototype.slice.call(this.children)
            //         .map(x => this.removeChild(x))
            //         .sort((e1, e2) => sortFunction(e1.firstChild, e2.firstChild))
            //         .forEach(x => this.appendChild(x));
            //     break;
            default:
                throw 'NotImplementedException';
        }
    }

}

function parseBind(bindKey, bindValue) {
    switch (bindKey) {
        case 'style':
            for (let st in bindValue) {
                if (bindValue.hasOwnProperty(st)) {
                    this.bindTemplates.push({
                        path: `${bindKey}.${st}`,
                        key : bindValue[st].$key
                    });
                }
            }
            break;
        default:
            if (bindValue.hasOwnProperty('__bind__')) {
                this.bindTemplates.push({
                    path: bindKey,
                    key : bindValue.$key
                });
            }
    }
}

ElementList.prototype.render = function (root) {
    let el            = new DynamicElement(this.parentTagName, this.parentProps, this.elements).render(root);
    el._props         = this.props;
    el._bindTemplates = this.bindTemplates;
    this.watchers.forEach(w => el._watchers.push(new Watcher(w.model, w.expression, w.update.bind(el))));
    return el;
};
