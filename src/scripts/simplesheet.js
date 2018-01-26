import Element from './element';
import Div from './div';
import Vector2 from './vector2';
import easingFuncs from './easingfuncs';

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
    let startPosition = new Vector2();
    let offset = new Vector2();
    let directVector = new Vector2();
    let scrollLeft = 0,
        scrollTop = 0;

    scrollElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startPosition.x = e.changedTouches[0].pageX;
        startPosition.y = e.changedTouches[0].pageY;
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
        let endPosition = new Vector2(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        offset = endPosition.subtract(startPosition);
        directVector = offset;

        if (endPosition.x > rect.left &&
            endPosition.y > rect.top &&
            endPosition.x < (rect.left + rect.width) &&
            endPosition.y < (rect.top + rect.height)) {

            let angle = directVector.getAngleDegrees();
            if (angle >= -135 && angle <= -45) {
                // to up
                directVector.x = 0;
            } else if (angle > 45 && angle < 135) {
                // to down
                directVector.x = 0;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                // to left
                directVector.y = 0;
            } else if (angle >= -45 && angle <= 45) {
                // to right
                directVector.y = 0;
            }

            let top = scrollTop - directVector.y;
            let left = scrollLeft - directVector.x;

            // Math.max(Math.min(inputX, MAX), MIN)
            scrollElement.scrollTop = Math.max(Math.min(top, scrollElement.scrollHeight), 0);
            scrollElement.scrollLeft = Math.max(Math.min(left, scrollElement.scrollWidth), 0);
        }
    }, false);

    scrollElement.addEventListener('touchend', (e) => {
        e.preventDefault();
        endTime = e.timeStamp;
        let duration = endTime - startTime;
        let magnitude = offset.length();
        let speedRadius = (magnitude / duration) * 10;
        let loopCount = 10 * speedRadius;
        let index = 0;
        let loopAction = () => {
            let currentScroll = new Vector2(scrollElement.scrollLeft, scrollElement.scrollTop);
            let length = directVector.length();
            if (length > 0) {
                let norm = directVector.divide(length);
                let x = 1 - index / loopCount;
                let easeRadius = easingFuncs.easeInOutQuad(x);
                currentScroll = currentScroll.subtract(norm.multiply(speedRadius * easeRadius));

                scrollElement.scrollLeft = currentScroll.x;
                scrollElement.scrollTop = currentScroll.y;
            }
            if (index < loopCount) {
                index++;
                requestAnimationFrame(loopAction);
            }
        };
        loopAction();
    }, false);
};

export default SimpleSheet;
