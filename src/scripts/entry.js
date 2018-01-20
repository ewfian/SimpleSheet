import * as math from './math';

if (!window.SimpleSheet) {
    var SimpleSheet = function (query) {
        this.container = document.querySelector(query);
        console.log(query);
        console.log('2π = ' + math.sum(math.pi, math.pi));

    };
    window.SimpleSheet = SimpleSheet;
}
