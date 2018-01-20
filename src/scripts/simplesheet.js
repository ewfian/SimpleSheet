import Element from './element';

var SimpleSheet = function (query) {
    this.container = document.querySelector(query);
    console.log(query);


    var e0 = new Element('div', {
        class: 'saf',
        style: {
            'background-color': 'red',
            'height': 50,
            'width': 50,
            'position': 'absolute',
            top: '6rem'
        }
    }, ['simple', new Element('input', {
        'value': 1232,
        class: 'dd',
        style: {
            top: 30,
            'position': 'absolute',
        }
    })]);

    var e1 = new Element('select', {
        'id': 'select0'
    }, new Element(
        'option', {
            'value': '2'
        }, 'one'
    ));

    var e2 = new Element('div', {
        style: {
            'position': 'relative'
        },
        height: 10,
        width: 20
    }, [456, e0, new Element('button', 5), new Element('button', {
        style: {
            'font-size': '20pt'
        }
    }, 6)]);


    this.container.appendChild(e2.render());
    console.log(e2);
    console.log(e2.render());

};

export default SimpleSheet;
