export function Depend() {
    this._subs     = [];
    this.depend_id = (Math.random() + 1).toString(36).substring(2);
}

Depend.prototype.addSub = function (callback) {
    this._subs.push(callback);
};

Depend.prototype.notify = function (op, args) {
    this._subs.forEach(function (call) {
        call.run(op, args);
    });
};

Depend.prototype.removeSub = function (callback) {
    let index = this._subs.indexOf(callback);
    if (index > -1) {
        this._subs.splice(index, 1);
    }
};

Depend.prototype.destroy = function () {
    this._subs = [];
};

Depend.target = null;
