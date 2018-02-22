import { default as tableScrollEvent } from './events/tablescrollevents';
import { SheetLayout } from './sheetlayout';

export function SimpleSheet(el) {
    let root = this.container = document.querySelector(el);

    let sheetLayout = new SheetLayout(root);
    sheetLayout.initBind();
    sheetLayout.initModel();


    let i = 20, j = 0, delta = 1, flag = false;
    setInterval(() => {
        if (j > 30 && !flag) {
            delta = -1;
            flag  = true;
        }
        if (j < 2 && flag) {
            delta = 1;
            flag  = false;
        }
        j += delta;
        i++;

        sheetLayout.viewModel.axis.horizontal.shift();
        sheetLayout.viewModel.axis.horizontal.unshift({
            width: 100,
            text : Math.floor(Math.random() * 100)
        });

        sheetLayout.viewModel.axis.vertical.splice(0, 1, {
            height: 100,
            text  : Math.floor(Math.random() * 10)
        });

        sheetLayout.viewModel.axis.horizontal[j].text  = i;
        sheetLayout.viewModel.axis.horizontal[j].width = i;

        sheetLayout.viewModel.axis.vertical[j].text   = i;
        sheetLayout.viewModel.axis.vertical[j].height = i;
        console.log(i, j, delta);
    }, 1000);


    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
}
