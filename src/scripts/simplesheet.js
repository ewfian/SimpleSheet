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
            horizontal: ['A', 'B', 'C', 'D', 'E'],
            vertical: []
        },
        width: 50,
        height: 50,
        radius: '50%',
        color: '#b4b4b4',
        value: 'Test'
    };
    let mvvm = this.mvvm = new Mvvm(this.model);

    root.querySelector('.grid-bg').appendChild(new DynamicElement('div', {
        style: {
            position: 'absolute',
            display: 'inline-block',
            'text-align': 'center',
            'z-index': 10,
            top: mvvm.bindModel('width'),
            left: mvvm.bindModel('height'),
            width: mvvm.bindModel('width'),
            height: mvvm.bindModel('height'),
            'line-height': mvvm.bindModel('height'),
            'border-radius': mvvm.bindModel('radius'),
            'background-color': mvvm.bindModel('color'),
        },
        class: mvvm.bindModel('width')
    }, mvvm.bindModel('color')).render());

    let elist = new ElementList('div', { class: 'ruler-cell' }, mvvm.bindModel('axis.horizontal'));
    setInterval(() => {
        this.model.width = Math.random() * 200 + 50;
        this.model.height = parseInt(Math.random() * 200 + 50);
        this.model.radius = Math.random() * 100 + '%';
        this.model.color = '#' + ((1 << 24) * Math.random() | 0).toString(16);
        this.model.value = this.model.color;
        this.model.axis.horizontal.push(parseInt(Math.random() * 10) + 1);
        this.model.axis.horizontal.shift();
    }, 500);

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

    root.querySelector('.horizontal-ruler').appendChild(elist.render());
    root.querySelector('.vertical-ruler').appendChild(vRulerCells.render());

    root.querySelector('.grid-bg').appendChild(hTableLines.render());
    root.querySelector('.grid-bg').appendChild(vTableLines.render());

    tableScrollEvent(root.querySelector('.table-grid'), root.querySelector('.vertical-ruler'), root.querySelector('.horizontal-ruler .ruler-cells'));
};

export default SimpleSheet;
