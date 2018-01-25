const pixelValues = ['backgroundPositionX', 'backgroundPositionY', 'backgroundRepeatX', 'backgroundRepeatY', 'baselineShift', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderBottomWidth', 'borderImageWidth', 'borderLeftWidth', 'borderRadius', 'borderRightWidth', 'borderSpacing', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopWidth', 'borderWidth', 'bottom', 'fontSize', 'height', 'left', 'letterSpacing', 'lineHeight', 'margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'outlineOffset', 'outlineWidth', 'overflowX', 'overflowY', 'padding', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'right', 'strokeWidth', 'textIndent', 'textLineThroughWidth', 'textOverlineWidth', 'textUnderlineWidth', 'top', 'width', 'wordSpacing'];

export default {
    type(obj) {
        return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
    },
    slice(arrayLike, index) {
        return Array.prototype.slice.call(arrayLike, index);
    },
    truthy(value) {
        return !!value;
    },
    isArray(object) {
        return this.type(object) === 'Array';
    },
    isString(object) {
        return this.type(object) === 'String';
    },
    isNumeric(object) {
        return !isNaN(parseFloat(object)) && isFinite(object);
    },
    isObject(object) {
        return object && typeof object == 'object' &&
            (object == window || object instanceof Object);
    },
    setAttr(node, key, value) {
        switch (key) {
            case 'style':
                for (let st in value) {
                    if (value.hasOwnProperty(st)) {
                        let styleValue = value[st];
                        node.style[st] = pixelValues.indexOf(st) > -1 && this.isNumeric(styleValue) ? styleValue + 'px' : styleValue;
                    }
                }
                break;
            case 'value':
                var tagName = node.tagName || '';
                tagName = tagName.toLowerCase();
                if (tagName === 'input' || tagName === 'textarea') {
                    node.value = value;
                } else {
                    node.setAttribute(key, value);
                }
                break;
            default:
                node.setAttribute(key, value);
                break;
        }
    },
    inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
};
