import Element from './element';
import Div from './div';

let SimpleSheet = function (query) {
    this.container = document.querySelector(query);
    let root = this.container;

    let hRulerCells = new Div('ruler-cells', [].concat.apply([], Array(26))
        .map((_, i) => {
            return new Div('ruler-cell', String.fromCharCode(i + 65));
        }));

    let vRulerCells = new Div('ruler-cells', [].concat.apply([], Array(50))
        .map((_, i) => {
            return new Div('ruler-cell', i + 1);
        }));


    let tableCells = new Div('table-grid', [].concat.apply([], Array(26 * 50))
        .map((_, i) => {
            return new Element('div', {
                style: {
                    left: (i % 26) * 72,
                    top: Math.floor(i / 26) * 18,

                },
                class: 'table-cell'
            });
        }));

    root.querySelector('.horizontal-ruler').appendChild(hRulerCells.render());
    root.querySelector('.vertical-ruler').appendChild(vRulerCells.render());
    root.querySelector('.table-content').appendChild(tableCells.render());


    let ticking = false;
    root.querySelector('.table-grid').addEventListener('scroll', (e) => {
        let {
            scrollTop,
            scrollLeft
        } = e.target;
        if (!ticking) {
            requestAnimationFrame(() => {
                root.querySelector('.vertical-ruler').style.top = -scrollTop + 'px';
                root.querySelector('.horizontal-ruler .ruler-cells').style.left = -scrollLeft + 'px';
                ticking = false;
            });
            ticking = true;
        }
    });

};

export default SimpleSheet;
