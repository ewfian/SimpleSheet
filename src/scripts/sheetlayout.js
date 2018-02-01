import { generateRulerText } from './utilities';
import { Element, Div, DynamicElement, ElementList } from './elements';
import { Mvvm } from './mvvm';

export function SheetLayout(root, rows = 96, columns = 103, rowHeight = 18, columnWidth = 72) {
    this._options = {
        rows,
        columns,
        rowHeight,
        columnWidth
    };

    this.model = {
        axis: {
            horizontal: [],
            vertical: []
        },
    };
    let mvvm = this.mvvm = new Mvvm(this.model);

    let hRulerCells = new ElementList(mvvm.bindModel('axis.horizontal'), { class: 'ruler-cells' }, {
        class: 'ruler-cell',
        style: { width: mvvm.bindItem('width') },
        textContent: mvvm.bindItem('text')
    }).render();

    let vRulerCells = new Div('ruler-cells', [].concat.apply([], Array(rows))
        .map((_, i) => {
            return new Div('ruler-cell', i + 1);
        }));

    let hTableLines = new Div('h-lines', [].concat.apply([], Array(rows))
        .map((_, i) => {
            return new Element('div', {
                style: {
                    top: (i % rows) * 18,
                    width: columns * 72
                },
                class: 'line'
            });
        }));

    let vTableLines = new Div('v-lines', [].concat.apply([], Array(columns))
        .map((_, i) => {
            return new Element('div', {
                style: {
                    left: (i % columns) * 72,
                    height: rows * 18,
                },
                class: 'line'
            });
        }));

    root.querySelector('.horizontal-ruler').appendChild(hRulerCells);
    root.querySelector('.vertical-ruler').appendChild(vRulerCells.render());

    root.querySelector('.grid-bg').appendChild(hTableLines.render());
    root.querySelector('.grid-bg').appendChild(vTableLines.render());

}
SheetLayout.prototype.initModel = function () {

};
