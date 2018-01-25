import _ from './util';
import Element from './element';


let Div = function (className, children, props) {
    Element.call(this, 'div', Object.assign({
        class: className
    }, props), children);
};

_.inherits(Div, Element);


export default Div;
