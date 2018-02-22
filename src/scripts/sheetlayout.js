import { generateRulerText, runNTimes } from './utilities';
import { ElementList } from './elements';
import { Mvvm } from './mvvm';
import { Watcher } from './mvvm/watcher';

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
            vertical  : []
        },
        grid: {
            width : 0,
            height: 0
        }
    };

    this.mvvm = new Mvvm(this.viewModel);
    this.root = root;
}

SheetLayout.prototype.initBind = function () {
    let mvvm = this.mvvm;
    let root = this.root;

    let hRulerCells = new ElementList(mvvm.bindModel('axis.horizontal'), {class: 'ruler-cells'}, {
        class      : 'ruler-cell',
        style      : {width: mvvm.bindItem('width')},
        textContent: mvvm.bindItem('text')
    }).render(root.querySelector('.horizontal-ruler'));

    let vRulerCells = new ElementList(mvvm.bindModel('axis.vertical'), {class: 'ruler-cells'}, {
        class      : 'ruler-cell',
        style      : {height: mvvm.bindItem('height')},
        textContent: mvvm.bindItem('text')
    }).render(root.querySelector('.vertical-ruler'));

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
    }).render(root.querySelector('.grid-bg'));

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
    }).render(root.querySelector('.grid-bg'));
};

SheetLayout.prototype.initModel = function () {
    let model   = this.viewModel;
    let options = this._options;

    new Watcher(model, 'axis.horizontal', () => {
        model.grid.width = model.axis.horizontal.map(h => h.width).reduce((acc, curr) => acc + curr, 0);
    });

    new Watcher(model, 'axis.vertical', () => {
        model.grid.height = model.axis.vertical.map(v => v.height).reduce((acc, curr) => acc + curr, 0);
    });

    runNTimes(options.columns, (i) => {
        model.axis.horizontal.push({
            width: options.columnWidth,
            text : generateRulerText(i)
        });
    });

    runNTimes(options.rows, (i) => {
        model.axis.vertical.push({
            height: options.rowHeight,
            text  : i + 1
        });
    });
};
