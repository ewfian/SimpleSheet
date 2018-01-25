import Element from './element';
import Div from './div';
import Vector2 from './vector2';
import easingFuncs from './easingfuncs';
import easingfuncs from './easingfuncs';

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

    let startTime, endTime;
    let startX, startY;
    let offsetX, offsetY;

    let positionX, positionY;

    let scrollLeft = 0,
        scrollTop = 0;
    scrollElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startX = e.changedTouches[0].pageX;
        startY = e.changedTouches[0].pageY;
        scrollLeft = scrollElement.scrollLeft;
        scrollTop = scrollElement.scrollTop;
        startTime = e.timeStamp;
    }, false);
    scrollElement.addEventListener('touchmove', (e) => {
        //https://www.tjvantoll.com/2012/08/19/onscroll-event-issues-on-mobile-browsers/
        //http://www.haorooms.com/post/webapp_bodyslidebcdiv
        //Prevent the window from being scrolled.
        e.preventDefault();
        let rect = scrollElement.getBoundingClientRect();
        let moveEndX = e.changedTouches[0].pageX,
            moveEndY = e.changedTouches[0].pageY;

        offsetX = moveEndX - startX;
        offsetY = moveEndY - startY;

        positionX = offsetX;
        positionY = offsetY;

        if (moveEndX > rect.left &&
            moveEndY > rect.top &&
            moveEndX < (rect.left + rect.width) &&
            moveEndY < (rect.top + rect.height)) {

            //if (Math.abs(tapX) < 2 && Math.abs(tapY) < 2) return;

            let angle = Math.atan2(positionY, positionX) * 180 / Math.PI;
            if (angle >= -135 && angle <= -45) {
                // to up
                positionX = 0;
            } else if (angle > 45 && angle < 135) {
                // to down
                positionX = 0;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                // to left
                positionY = 0;
            } else if (angle >= -45 && angle <= 45) {
                // to right
                positionY = 0;
            }

            let top = scrollTop - positionY;
            let left = scrollLeft - positionX; /// (scrollElement.scrollWidth / scrollElement.scrollHeight);

            // Math.max(Math.min(inputX, MAX), MIN)
            scrollElement.scrollTop = Math.max(Math.min(top, scrollElement.scrollHeight), 0);
            scrollElement.scrollLeft = Math.max(Math.min(left, scrollElement.scrollWidth), 0);
        }
    }, false);

    scrollElement.addEventListener('touchend', (e) => {
        e.preventDefault();
        endTime = e.timeStamp;

        let duration = endTime - startTime;

        let magtitude = new Vector2(offsetX, offsetY).length();

        let speedRadius = magtitude / duration * 5;

        let loopCount = 100 * speedRadius;

        let currentScroll = new Vector2(scrollElement.scrollLeft, scrollElement.scrollTop);

        let index = 0;
        let loopAction = () => {
            let position = new Vector2(positionX, positionY);
            let length = position.length();
            if (length > 0) {
                let norm = position.divide(position.length());
                let x = 1 - index / loopCount;
                let easeRadius = easingFuncs.circularOut(x);
                currentScroll = currentScroll.subtract(norm.multiply(speedRadius * easeRadius));
                //window.requestAnimationFrame(() => {
                scrollElement.scrollLeft = currentScroll.x;
                scrollElement.scrollTop = currentScroll.y;
                //});
            }
            if (index < loopCount) {
                index++;
                setTimeout(loopAction, 30);
            }
        };
        setTimeout(loopAction, 30);
    }, false);
};

export default SimpleSheet;
