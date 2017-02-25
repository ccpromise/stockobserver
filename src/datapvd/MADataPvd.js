
exports.MADataPvd = MADataPvd;

var HistoryDataPvd = require('./HistoryDataPvd').HistoryDataPvd;

MADataPvd.prototype.getNearTs = HistoryDataPvd.prototype.getNearTs;

function MADataPvd(dataPvd, N) {
    HistoryDataPvd.call(this, dataPvd, N);
}

MADataPvd.prototype.hasDef = HistoryDataPvd.prototype.hasDef;

MADataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = HistoryDataPvd.prototype.get.call(this, ts);
    return data.reduce((pre, cur) => { return pre+cur; }) / this.N;
}
