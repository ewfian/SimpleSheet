import { default as tableScrollEvent } from './events/tablescrollevents';
import { SheetLayout } from './sheetlayout';
import { setAttr } from './utilities';

export function SimpleSheet(el) {
    let root = this.container = document.querySelector(el);

    let sheetLayout = new SheetLayout(root);
    sheetLayout.initBind();
    sheetLayout.initModel();


    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);

    let target        = null;
    let moveResizeBar = e => {
        this.target = target;
        let parent  = target.parentElement;
        let width   = e.clientX - parent.getBoundingClientRect().left;

        if (width > 0) {
            setAttr(parent, 'style', {width: width});
        }
    };
    root.querySelector('.workspace').addEventListener('mousedown', e => {
        if (Array.from(e.target.classList).indexOf('h-resizer') > -1) {

            target = e.target;
            window.addEventListener('mousemove', moveResizeBar);

            window.addEventListener('mouseup',
                () => window.removeEventListener('mousemove', moveResizeBar),
                {once: true}
            );
        }
    });

    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
}
