export function Depend() {
    this._subsQueue = [];
    this.id = (Math.random() + 1).toString(36).substring(2);
}

Depend.prototype.addSub = function (callback) {
    this._subsQueue.push(callback);
};

Depend.prototype.notify = function () {
    this._subsQueue.forEach(function (call) {
        call.run();
    });
};

Depend.prototype.removeSub = function (callback) {
    let index = this._subsQueue.indexOf(callback);
    if (index > -1) {
        this._subsQueue.splice(index, 1);
    }
};

Depend.prototype.destroy = function () {
    this._subsQueue = [];
};

Depend.target = null;
