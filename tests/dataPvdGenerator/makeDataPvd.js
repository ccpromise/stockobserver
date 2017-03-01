
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
}).catch((err) => {console.log(err)});
