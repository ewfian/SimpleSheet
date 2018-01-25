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


    let scrollElement = root.querySelector('.table-grid');
    let ticking = false;
    scrollElement.addEventListener('scroll', (e) => {
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

    let startX, startY;
    let scrollLeft = 0,
        scrollTop = 0;
    scrollElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startX = e.changedTouches[0].pageX;
        startY = e.changedTouches[0].pageY;
    }, false);
    scrollElement.addEventListener('touchmove', (e) => {
        //https://www.tjvantoll.com/2012/08/19/onscroll-event-issues-on-mobile-browsers/
        //http://www.haorooms.com/post/webapp_bodyslidebcdiv
        //Prevent the window from being scrolled.
        e.preventDefault();
        let rect = scrollElement.getBoundingClientRect();
        let moveEndX = e.changedTouches[0].pageX,
            moveEndY = e.changedTouches[0].pageY,
            tapX = moveEndX - startX,
            tapY = moveEndY - startY;

        if (moveEndX > rect.left &&
            moveEndY > rect.top &&
            moveEndX < (rect.left + rect.width) &&
            moveEndY < (rect.top + rect.height)) {


            if (Math.abs(tapX) < 2 && Math.abs(tapY) < 2) return;

            let angle = Math.atan2(tapY, tapX) * 180 / Math.PI;
            if (angle >= -135 && angle <= -45) {
                // to up
                tapX = 0;
            } else if (angle > 45 && angle < 135) {
                // to down
                tapX = 0;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                // to left
                tapY = 0;
            } else if (angle >= -45 && angle <= 45) {
                // to right
                tapY = 0;
            }
            // Math.max(Math.min(inputX, MAX), MIN)
            scrollElement.scrollTop = Math.max(Math.min(
                scrollTop -= tapY / (scrollElement.scrollHeight / 800),
                scrollElement.scrollHeight), 0);

            scrollElement.scrollLeft = Math.max(Math.min(
                scrollLeft -= tapX / (scrollElement.scrollWidth / 800),
                scrollElement.scrollWidth), 0);
        }
    }, false);
};

export default SimpleSheet;
