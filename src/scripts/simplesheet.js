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
    let width         = 0;
    let moveResizeBar = e => {
        this.target = target;
        let parent  = target.parentElement;
        width       = e.clientX - parent.getBoundingClientRect().left;

        if (width > 0) {
            setAttr(parent, 'style', {width: width});
            root.querySelector('.resizeline-col').style.left = width + 'px';
        }
    };
    root.querySelector('.workspace').addEventListener('mousedown', e => {
        if (Array.from(e.target.classList).indexOf('h-resizer') > -1) {

            target    = e.target;
            let index = Array.prototype.slice.call(target.parentElement.parentElement.children).indexOf(target.parentElement);

            target.classList.add('resizing');

            window.addEventListener('mousemove', moveResizeBar);

            window.addEventListener('mouseup',
                () => {
                    sheetLayout.viewModel.axis.horizontal[index].width = width;
                    target.classList.remove('resizing');
                    root.querySelector('.resizeline-col').style.left = 0;
                    window.removeEventListener('mousemove', moveResizeBar);
                },
                {once: true}
            );
        }
    });

    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
}
