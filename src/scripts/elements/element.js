import * as _ from './../utilities';

export function Element(tagName, props, children) {
    if (!(this instanceof Element)) {
        if (!_.isArray(children) && children != null) {
            children = _.slice(arguments, 2).filter(_.truthy);
        }
        return new Element(tagName, props, children);
    }

    if (!_.isObject(props) || _.isArray(props)) {
        children = props;
        props = {};
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = _.isArray(children) ? children : [].concat(children || []);
}

Element.prototype.appendChild = function (child) {
    this.children.push(child);
};

Element.prototype.appendChildren = function (children) {
    this.children.push(...children);
};

Element.prototype.render = function () {
    let el = document.createElement(this.tagName);
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
        el.appendChild((child instanceof Element) ?
            child.render() :
            document.createTextNode(child));
    });

    return el;
};
