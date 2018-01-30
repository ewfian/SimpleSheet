const pixelValues = ['backgroundPositionX', 'backgroundPositionY', 'backgroundRepeatX', 'backgroundRepeatY', 'baselineShift', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderBottomWidth', 'borderImageWidth', 'borderLeftWidth', 'borderRadius', 'borderRightWidth', 'borderSpacing', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopWidth', 'borderWidth', 'bottom', 'fontSize', 'height', 'left', 'letterSpacing', 'lineHeight', 'margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'outlineOffset', 'outlineWidth', 'overflowX', 'overflowY', 'padding', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'right', 'strokeWidth', 'textIndent', 'textLineThroughWidth', 'textOverlineWidth', 'textUnderlineWidth', 'top', 'width', 'wordSpacing'];

let type = (obj) => {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
};
let slice = (arrayLike, index) => {
    return Array.prototype.slice.call(arrayLike, index);
};
let truthy = (value) => {
    return !!value;
};
let isArray = (object) => {
    return type(object) === 'Array';
};
let isString = (object) => {
    return type(object) === 'String';
};
let isNumeric = (object) => {
    return !isNaN(parseFloat(object)) && isFinite(object);
};
let isObject = (object) => {
    return object && typeof object == 'object' &&
        (object == window || object instanceof Object);
};
let getPixelValue = (key, vaule) => {
    return pixelValues.indexOf(key) > -1 && isNumeric(vaule) ? vaule + 'px' : vaule;
};
let setAttr = (node, key, value) => {
    switch (key) {
        case 'style':
            for (let st in value) {
                if (value.hasOwnProperty(st)) {
                    let styleValue = value[st];
                    node.style[st] = getPixelValue(st, styleValue);
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
};
let inherits = (subClass, superClass) => {
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
};
let generateRulerText = function (index) {
    let letters = [];
    index += 1;
    while (index > 0) {
        let m = index % 26 || 26;
        letters.unshift(String.fromCharCode(64 + m));
        index = (index - m) / 26;
    }
    return letters.join('');
};

let parseExpression = exp => {
    let exps = exp.split('.');
    return obj => {
        exps.forEach(key => {
            obj = obj[key.trim()];
        });
        return isObject(obj) ? JSON.parse(JSON.stringify(obj, (key, value) =>
            // https://stackoverflow.com/questions/4910567/hide-certain-values-in-output-from-json-stringify
            key == '__observe__' ? undefined : value
        )) : obj;
    };
};

export {
    truthy,
    slice,
    isArray,
    isString,
    isNumeric,
    isObject,
    setAttr,
    inherits,
    generateRulerText,
    parseExpression,
    getPixelValue
};
