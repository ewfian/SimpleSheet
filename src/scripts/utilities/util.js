const pixelValues = ['background-position-x', 'background-position-y', 'background-repeat-x', 'background-repeat-y', 'baseline-shift', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-bottom-width', 'border-image-width', 'border-left-width', 'border-radius', 'border-right-width', 'border-spacing', 'border-top-left-radius', 'border-top-right-radius', 'border-top-width', 'border-width', 'bottom', 'font-size', 'height', 'left', 'letter-spacing', 'line-height', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width', 'min-height', 'min-width', 'outline-offset', 'outline-width', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'right', 'stroke-width', 'text-indent', 'text-line-through-width', 'text-overline-width', 'text-underline-width', 'top', 'width', 'word-spacing'];

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
        case 'textContent':
            node.textContent = value;
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

let deepCopyBoundProps = obj => JSON.parse(JSON.stringify(obj, (key, value) =>
    // https://stackoverflow.com/questions/4910567/hide-certain-values-in-output-from-json-stringify
    key == '__observe__' ? undefined : value
));

let parseExpression = exp => {
    let exps = exp.split('.');
    return obj => {
        exps.forEach(key => {
            obj = obj[key.trim()];
        });
        return isObject(obj) ? deepCopyBoundProps(obj) : obj;
    };
};

let updateObjectByPath = (_object, newValue, path) => {
    let stack = path.split('.');
    while (stack.length > 1) {
        _object = _object[stack.shift()];
    }
    _object[stack.shift()] = newValue;
};

let runNTimes = (n, f) => { let i = 0; while (n-- > 0) f(i++); };

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
    getPixelValue,
    updateObjectByPath,
    deepCopyBoundProps,
    runNTimes
};
