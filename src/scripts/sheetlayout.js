import { generateRulerText, runNTimes } from './utilities';
import { ElementList } from './elements';
import { Mvvm } from './mvvm';

export function SheetLayout(root, rows = 96, columns = 103, rowHeight = 18, columnWidth = 72) {
    this._options = {
        rows,
        columns,
        rowHeight,
        columnWidth
    };

    this.viewModel = {
        axis: {
            horizontal: [],
            vertical: []
        },
        grid: {
            width: 1,
            height: 1
            //TODO : cannot equals 0
        }
    };
    let mvvm = this.mvvm = new Mvvm(this.viewModel);

    let hRulerCells = new ElementList(mvvm.bindModel('axis.horizontal'), { class: 'ruler-cells' }, {
        class: 'ruler-cell',
        style: { width: mvvm.bindItem('width') },
        textContent: mvvm.bindItem('text')
    }).render();

    let vRulerCells = new ElementList(mvvm.bindModel('axis.vertical'), { class: 'ruler-cells' }, {
        class: 'ruler-cell',
        style: { height: mvvm.bindItem('height') },
        textContent: mvvm.bindItem('text')
    }).render();

    let hTableLines = new ElementList(mvvm.bindModel('axis.vertical'), {
        class: 'h-lines',
        style: {
            width: mvvm.bindModel('grid.width')
        }
    }, {
        class: 'line',
        style: {
            height: mvvm.bindItem('height')
        }
    }).render();

    let vTableLines = new ElementList(mvvm.bindModel('axis.horizontal'), {
        class: 'v-lines',
        style: {
            height: mvvm.bindModel('grid.height')
        }
    }, {
        class: 'line',
        style: {
            width: mvvm.bindItem('width')
        }
    }).render();

    root.querySelector('.horizontal-ruler').appendChild(hRulerCells);
    root.querySelector('.vertical-ruler').appendChild(vRulerCells);

    root.querySelector('.grid-bg').appendChild(hTableLines);
    root.querySelector('.grid-bg').appendChild(vTableLines);

}
SheetLayout.prototype.initModel = function () {
    let model = this.viewModel;
    let options = this._options;

    runNTimes(options.columns, (i) => {
        model.axis.horizontal.push({
            width: options.columnWidth,
            text: generateRulerText(i)
        });
    });

    model.axis.horizontal.shift();
    model.axis.horizontal.unshift({
        width: 200,
        text: 'A'
    });

    runNTimes(options.rows, (i) => {
        model.axis.vertical.push({
            height: options.rowHeight,
            text: i + 1
        });
    });

    model.axis.vertical.shift();
    model.axis.vertical.unshift({
        height: 200,
        text: '1'
    });

    model.grid.width = model.axis.horizontal.map(h => h.width).reduce((acc, curr) => acc + curr);
    model.grid.height = model.axis.vertical.map(v => v.height).reduce((acc, curr) => acc + curr);
};
