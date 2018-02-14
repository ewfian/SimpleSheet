import { default as tableScrollEvent } from './events/tablescrollevents';
import { SheetLayout } from './sheetlayout';
import { Watcher } from './mvvm/watcher';

export function SimpleSheet(el) {
    let root = this.container = document.querySelector(el);

    let sheetLayout = new SheetLayout(root);
    sheetLayout.initBind();
    sheetLayout.initModel();

    sheetLayout.viewModel.axis.horizontal.shift();
    sheetLayout.viewModel.axis.horizontal.unshift({
        width: 200,
        text: 'A.test'
    });

    sheetLayout.viewModel.axis.vertical.splice(0, 1, {
        height: 200,
        text: '1.t'
    });

    // let i = 10;
    // setInterval(() => {
    //     sheetLayout.viewModel.axis.horizontal.splice(2, 1, {
    //         width: Math.floor(Math.random() * 200 + 20),
    //         text: generateRulerText(Math.floor(Math.random() * 2000))
    //     });
    //     sheetLayout.viewModel.axis.vertical.splice(2, 1, {
    //         height: Math.floor(Math.random() * 100 + 30),
    //         text: Math.floor(Math.random() * 100)
    //     });
    //     // sheetLayout.viewModel._proxy.axis.horizontal[0].width = i++;
    // }, 1000);

    //     sheetLayout.viewModel.axis.horizontal.splice(2, 1, {
    //         width: Math.floor(Math.random() * 200 + 20),
    //         text: generateRulerText(Math.floor(Math.random() * 2000))
    //     });

    new Watcher(sheetLayout.viewModel, 'axis.horizontal.0', (newValue, oldValue) => {
        console.log('cb', newValue, oldValue);
    });

    new Watcher(sheetLayout.viewModel, 'axis.horizontal.1', (newValue, oldValue) => {
        console.log('cb', newValue, oldValue);
    });

    new Watcher(sheetLayout.viewModel, 'axis.vertical.2', (newValue, oldValue) => {
        console.log('cb', newValue, oldValue);
    });

    console.log(sheetLayout.viewModel);

    // sheetLayout.viewModel.axis.horizontal.shift();

    // sheetLayout.viewModel.axis.horizontal.splice(2, 1, {
    //     width: Math.floor(Math.random() * 200 + 20),
    //     text: generateRulerText(Math.floor(Math.random() * 2000))
    // });

    // sheetLayout.viewModel.axis.horizontal[0].width = 125;
    // sheetLayout.viewModel.axis.horizontal[0].width = 126;
    // sheetLayout.viewModel.axis.horizontal[1].width = 35;
    // sheetLayout.viewModel.axis.horizontal[2].width = 25;

    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
}
