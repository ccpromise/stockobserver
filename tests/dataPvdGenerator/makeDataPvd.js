
var loadStockData = require('../../src/stockdata').loadStockData;
var makeDataPvd = require('../../src/dataPvdGenerator').makeDataPvd;
var assert = require('assert');

loadStockData('000001.XSHE').then((data) => {
    var x = makeDataPvd('end', [data]);
    var y = makeDataPvd('end', [data]);
    assert.equal(x.get(17252), y.get(17252));
    assert.equal(x.minTs, y.minTs);
    assert.equal(x.maxTs, y.maxTs);
    var p = makeDataPvd('ma', [x, 5]);
    var q = makeDataPvd('ma', [x, 10]);
    var r = makeDataPvd('ma', [y, 10]);
    var s = makeDataPvd('macd', [x, [12, 26, 9]]);
    var t = makeDataPvd('macd', [x, [8, 12, 5]]);
    var m = makeDataPvd('add', [[x, p, q], 1]);
    var n = makeDataPvd('add', [[y, p, r], 1]);
    var a = makeDataPvd('const', ['str']);
    var b = makeDataPvd('offset', [p, 2]);
    assert(b.get(b.minTs), p.get(p.forwardDateTs(p.minTs, 2)));
}).catch((err) => {console.log(err)});
