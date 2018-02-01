import { default as tableScrollEvent } from './events/tablescrollevents';
import { SheetLayout } from './sheetlayout';

export function SimpleSheet(el) {
    let root = this.container = document.querySelector(el);

    let sheetlayout = new SheetLayout(root);
    sheetlayout.initModel();

    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
}
