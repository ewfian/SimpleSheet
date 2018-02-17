import { default as tableScrollEvent } from './events/tablescrollevents';
import { SheetLayout } from './sheetlayout';
import { Watcher } from './mvvm/watcher';

export function SimpleSheet(el) {
    let root = this.container = document.querySelector(el);

    let sheetLayout = new SheetLayout(root);
    sheetLayout.initBind();
    sheetLayout.initModel();

    new Watcher(sheetLayout.viewModel, 'axis', (newValue, oldValue) => {
        console.log('axis0', newValue, oldValue);
    });

    new Watcher(sheetLayout.viewModel, 'axis', (newValue, oldValue) => {
        console.log('axis1', newValue, oldValue);
    });

    new Watcher(sheetLayout.viewModel, 'axis.horizontal', (newValue, oldValue) => {
        console.log('axis.horizontal0', newValue, oldValue);
    });

    new Watcher(sheetLayout.viewModel, 'axis.vertical', (newValue, oldValue) => {
        console.log('axis.vertical', newValue, oldValue);
    });

    new Watcher(sheetLayout.viewModel, 'grid', (newValue, oldValue) => {
        console.log('grid0', newValue, oldValue);
    });
    new Watcher(sheetLayout.viewModel, 'grid.width', (newValue, oldValue) => {
        console.log('grid.width', newValue, oldValue);
    });

    sheetLayout.viewModel.axis.horizontal.shift();
    sheetLayout.viewModel.axis.horizontal.unshift({
        width: 200,
        text: 'A.test'
    });

    sheetLayout.viewModel.axis.vertical.splice(0, 1, {
        height: 200,
        text: '1.t'
    });

    // sheetLayout.viewModel.axis.vertical[0].width = 25;

    console.log(sheetLayout.viewModel);

    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
}
