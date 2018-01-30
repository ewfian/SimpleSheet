import { inherits } from './../utilities';
import { Element } from './element';

export function Div(className, children, props) {
    Element.call(this, 'div', Object.assign({
        class: className
    }, props), children);
}

inherits(Div, Element);
