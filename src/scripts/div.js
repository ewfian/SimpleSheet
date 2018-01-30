import { inherits } from './utilities';
import Element from './element';

let Div = function (className, children, props) {
    Element.call(this, 'div', Object.assign({
        class: className
    }, props), children);
};

inherits(Div, Element);

export default Div;
