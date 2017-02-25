
exports.StdDataPvd = StdDataPvd;

var HistoryDataPvd = require('./HistoryDataPvd').HistoryDataPvd;

StdDataPvd.prototype.getNearTs = HistoryDataPvd.prototype.getNearTs;

function StdDataPvd(dataPvd, N) {
    HistoryDataPvd.call(this, dataPvd, N);
}

StdDataPvd.prototype.hasDef = HistoryDataPvd.prototype.hasDef;

StdDataPvd.prototype.get = function(ts) {
    var data = HistoryDataPvd.prototype.get.call(this, ts);
    var ma = data.reduce((pre, cur) => { return pre+cur; }) / this.N;
    return Math.sqrt(data.reduce((pre, cur) => { return pre+Math.pow(cur-ma, 2); }, 0)/this.N);
}
