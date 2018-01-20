import _ from './util';

function Element(tagName, props, children) {
    if (!(this instanceof Element)) {
        if (!_.isArray(children) && children != null) {
            children = _.slice(arguments, 2).filter(_.truthy);
        }
        return new Element(tagName, props, children);
    }

    if (_.isArray(props)) {
        children = props;
        props = {};
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = _.isArray(children) ? children : new Array(children || []);
}

Element.prototype.render = function () {
    var el = document.createElement(this.tagName);
    var props = this.props;

    if (_.isObject(props)) {
        for (var propName in props) {
            if (props.hasOwnProperty(propName)) {
                var propValue = props[propName];
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

export default Element;
