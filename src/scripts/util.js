const pixelValues = ['backgroundPositionX', 'backgroundPositionY', 'backgroundRepeatX', 'backgroundRepeatY', 'baselineShift', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderBottomWidth', 'borderImageWidth', 'borderLeftWidth', 'borderRadius', 'borderRightWidth', 'borderSpacing', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopWidth', 'borderWidth', 'bottom', 'fontSize', 'height', 'left', 'letterSpacing', 'lineHeight', 'margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'outlineOffset', 'outlineWidth', 'overflowX', 'overflowY', 'padding', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'right', 'strokeWidth', 'textIndent', 'textLineThroughWidth', 'textOverlineWidth', 'textUnderlineWidth', 'top', 'width', 'wordSpacing'];

var _ = {};

_.type = function (obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
};
_.slice = function slice(arrayLike, index) {
    return Array.prototype.slice.call(arrayLike, index);
};
_.truthy = function truthy(value) {
    return !!value;
};
_.isArray = function isArray(object) {
    return _.type(object) === 'Array';
};
_.isString = function isString(object) {
    return _.type(object) === 'String';
};
_.isNumeric = function (object) {
    return !isNaN(parseFloat(object)) && isFinite(object);
};
_.isObject = function (object) {
    return object && typeof object == 'object' &&
        (object == window || object instanceof Object);
};

_.setAttr = function setAttr(node, key, value) {
    switch (key) {
        case 'style':
            for (let st in value) {
                if (value.hasOwnProperty(st)) {
                    let styleValue = value[st];
                    node.style[st] = pixelValues.indexOf(st) > -1 && _.isNumeric(styleValue) ? styleValue + 'px' : styleValue;
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

export default _;
