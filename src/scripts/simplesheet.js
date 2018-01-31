import { generateRulerText } from './utilities';
import { Mvvm } from './mvvm';
import { Element, Div, DynamicElement, ElementList } from './elements';
import { default as tableScrollEvent } from './events/tableScrollEvent';

let SimpleSheet = function (el) {
    this.container = document.querySelector(el);
    let root = this.container;
    let rows = 95,
        columns = 103;
    this.$options = {};

    this.model = {
        axis: {
            horizontal: [{
                text: 'Z',
                width: 20
            }],
            vertical: []
        },
        width: 50,
        height: 50,
        color: '#b4b4b4'
    };
    let mvvm = this.mvvm = new Mvvm(this.model);

    root.querySelector('.grid-bg').appendChild(new DynamicElement('div', {
        style: {
            position: 'absolute',
            display: 'inline-block',
            'text-align': 'center',
            'z-index': 10,
            // top: mvvm.bindModel('width'),
            // left: mvvm.bindModel('height'),
            width: mvvm.bindModel('width'),
            height: mvvm.bindModel('height'),
            'line-height': mvvm.bindModel('height'),
            'background-color': mvvm.bindModel('color'),
        },
        class: mvvm.bindModel('color'),
        textContent: mvvm.bindModel('color')
    }).render());

    let eList = new ElementList(mvvm.bindModel('axis.horizontal'), {
        class: 'ruler-cells',
        style: {
            left: mvvm.bindModel('width'),
        }
    }, {
        class: 'ruler-cell',
        style: {
            width: mvvm.bindItem('width')
        },
        textContent: mvvm.bindItem('text')
    });

    //['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
    setInterval(() => {
        this.model.width = Math.random() * 200 + 50;
        this.model.height = parseInt(Math.random() * 200 + 50);
        this.model.color = '#' + ((1 << 24) * Math.random() | 0).toString(16);
        this.model.axis.horizontal.push({
            text: Math.floor(Math.random() * 10),
            width: 40
        });
        this.model.axis.horizontal.shift();
    }, 1000);

    let hRulerCells = new Div('ruler-cells', [].concat.apply([], Array(columns))
        .map((_, i) => new Div('ruler-cell', generateRulerText(i)))
    );

    let vRulerCells = new Div('ruler-cells', [].concat.apply([], Array(rows))
        .map((_, i) => {
            return new Div('ruler-cell', i + 1);
        }));

    let hTableLines = new Div('h-lines', [].concat.apply([], Array(rows))
        .map((_, i) => {
            return new Element('div', {
                style: {
                    top: (i % rows) * 18,
                    width: columns * 72
                },
                class: 'line'
            });
        }));

    let vTableLines = new Div('v-lines', [].concat.apply([], Array(columns))
        .map((_, i) => {
            return new Element('div', {
                style: {
                    left: (i % columns) * 72,
                    height: rows * 18,
                },
                class: 'line'
            });
        }));

    root.querySelector('.horizontal-ruler').appendChild(eList.render());
    root.querySelector('.vertical-ruler').appendChild(vRulerCells.render());

    root.querySelector('.grid-bg').appendChild(hTableLines.render());
    root.querySelector('.grid-bg').appendChild(vTableLines.render());

    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
};

export default SimpleSheet;
