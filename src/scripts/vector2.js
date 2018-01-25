export default function Vector2(x, y) {
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
