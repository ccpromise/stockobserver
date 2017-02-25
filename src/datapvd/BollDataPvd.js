
exports.BollDataPvd = BollDataPvd;

var HistoryDataPvd = require('./HistoryDataPvd').HistoryDataPvd;

BollDataPvd.prototype.getNearTs = HistoryDataPvd.prototype.getNearTs;

function BollDataPvd(dataPvd, N) {
    HistoryDataPvd.call(this, dataPvd, N);
}

BollDataPvd.prototype.hasDef = HistoryDataPvd.prototype.hasDef;

BollDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = HistoryDataPvd.prototype.get.call(this, ts);
    var ma = data.reduce((pre, cur) => { return pre+cur; }) / this.N;
    var std = Math.sqrt(data.reduce((pre, cur) => { return pre+Math.pow(cur-ma, 2); }, 0)/this.N);
    return {
        'MB': ma,
        'UP': ma + 2 * std,
        'DW': ma - 2 * std,
    }
};
