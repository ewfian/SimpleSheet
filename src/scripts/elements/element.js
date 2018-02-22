import * as _ from './../utilities';

export function Element(tagName = 'div', props = {}, children = []) {
    if (!_.isObject(props) && Array.isArray(props)) {
        children = props;
        props    = {};
    }

    this.tagName  = tagName;
    this.props    = props || {};
    this.children = Array.isArray(children) ? children : [].concat(children);

    if (_.isObject(tagName)) {
        this.props   = tagName;
        this.tagName = 'div';
    }
}

Element.prototype.appendChild = function (child) {
    this.children.push(child);
};

Element.prototype.appendChildren = function (children) {
    this.children.push(...children);
};

Element.prototype.render = function (root) {
    let el    = document.createElement(this.tagName);
    let props = this.props;

    if (_.isObject(props)) {
        for (let propName in props) {
            if (props.hasOwnProperty(propName)) {
                let propValue = props[propName];
                _.setAttr(el, propName, propValue);
            }
        }
    }

    this.children.forEach(child => {
        el.appendChild(
            child instanceof Element
                ? child.render()
                : document.createTextNode(child)
        );
    });

    if (root) {
        root.appendChild(el);
    }
    return el;
};
