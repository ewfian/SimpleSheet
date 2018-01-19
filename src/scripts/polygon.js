var debug = console.log;

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}


var Vector2 = (function () {

    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector2.prototype.negative = function () {
        return new Vector2(-this.x, -this.y);
    };

    Vector2.prototype.add = function (v) {
        if (v instanceof Vector2) {
            return new Vector2(this.x + v.x, this.y + v.y);
        } else {
            return new Vector2(this.x + v, this.y + v);
        }
    };

    Vector2.prototype.subtract = function (v) {
        if (v instanceof Vector2) {
            return new Vector2(this.x - v.x, this.y - v.y);
        } else {
            return new Vector2(this.x - v, this.y - v);
        }
    };

    Vector2.prototype.multiply = function (v) {
        if (v instanceof Vector2) {
            return new Vector2(this.x * v.x, this.y * v.y);
        } else {
            return new Vector2(this.x * v, this.y * v);
        }
    };

    Vector2.prototype.divide = function (v) {
        if (v instanceof Vector2) {
            return new Vector2(this.x / v.x, this.y / v.y);
        } else {
            return new Vector2(this.x / v, this.y / v);
        }
    };

    Vector2.prototype.equals = function (v) {
        return this.x == v.x && this.y == v.y;
    };

    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };

    Vector2.prototype.cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };

    Vector2.prototype.length = function () {
        return Math.sqrt(this.dot(this));
    };

    Vector2.prototype.unit = function () {
        return this.divide(this.length());
    };

    Vector2.prototype.toArray = function (n) {
        return [this.x, this.y].slice(0, n || 2);
    };

    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };

    Vector2.prototype.init = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };

    return Vector2;
})();


var Polygon = (function () {

    function Polygon(vertices) {
        this.vertices = vertices || [];
    }

    Polygon.prototype.getArea = function () {
        var area = vertices2Edges(this.vertices)
            .map(
                edge => edge[1].cross(edge[0])
            )
            .reduce(
                (e1, e2) => e1 + e2
            );
        return Math.abs(area) * 0.5;
    };

    Polygon.prototype.getPerimeter = function () {
        return vertices2Edges(this.vertices)
            .map(
                edge => edge[1].subtract(edge[0]).length()
            )
            .reduce(
                (e1, e2) => e1 + e2
            );
    };

    var vertices2Edges = function (v) {
        var edge = [];
        v.push(v[0]);
        for (var i = 0; i < v.length - 1; i++) {
            edge.push([v[i], v[i + 1]]);
        }
        return edge;
    };

    return Polygon;
})();


var Triangle = (function () {

    function Triangle(vertices) {
        Polygon.call(this, vertices);
    }

    _inherits(Triangle, Polygon);

    Triangle.prototype.name = 'Triangle';

    Triangle.prototype.getArea = function () {
        var v = this.vertices;
        var a = v[0].subtract(v[2]).length();
        var b = v[1].subtract(v[0]).length();
        var c = v[2].subtract(v[1]).length();
        var p = (a + b + c) / 2;
        return Math.sqrt(p * (p - a) * (p - b) * (p - c)); // Heron's formula
    };

    Triangle.prototype.getPerimeter = function () {
        var v = this.vertices;
        var a = v[0].subtract(v[2]).length();
        var b = v[1].subtract(v[0]).length();
        var c = v[2].subtract(v[1]).length();
        return a + b + c;
    };

    return Triangle;
})();


var Quadrilateral = (function () {

    function Quadrilateral(vertices) {
        Polygon.call(this, vertices);
    }

    _inherits(Quadrilateral, Polygon);

    Quadrilateral.prototype.name = 'Quadrilateral';

    Quadrilateral.prototype.getArea = function () {
        var v = this.vertices;
        var d0 = v[2].subtract(v[0]);
        var d1 = v[3].subtract(v[1]);
        var m = d0.length();
        var n = d1.length();
        var cos = (d0.x * d1.x + d0.y * d1.y) / (m * n);
        var sin = Math.sqrt(1 - cos * cos);
        return m * n * Math.sqrt(sin) * 0.5;
    };

    Quadrilateral.prototype.getPerimeter = function () {
        var v = this.vertices;
        var a = v[0].subtract(v[3]).length();
        var b = v[1].subtract(v[0]).length();
        var c = v[2].subtract(v[1]).length();
        var d = v[3].subtract(v[2]).length();
        return a + b + c + d;
    };

    return Quadrilateral;
})();


var tri = new Triangle([
    new Vector2(0, 0),
    new Vector2(1, 0),
    new Vector2(0, 1)
]);
debug(tri.getPerimeter());
debug(tri.getArea());

var qua = new Quadrilateral([
    new Vector2(0, 0),
    new Vector2(1, 0),
    new Vector2(1, 1),
    new Vector2(0, 1)
]);
debug(qua.getPerimeter());
debug(qua.getArea());

var poly3 = new Polygon([
    new Vector2(0, 0),
    new Vector2(1, 0),
    new Vector2(0, 1)
]);
debug(poly3.getPerimeter());
debug(poly3.getArea());

var poly4 = new Polygon([
    new Vector2(0, 0),
    new Vector2(1, 0),
    new Vector2(1, 1),
    new Vector2(0, 1)
]);
debug(poly4.getPerimeter());
debug(poly4.getArea());
