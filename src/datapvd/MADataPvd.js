
module.exports = MADataPvd;

var HistoryDataPvd = require('./HistoryDataPvd');
var statistics = require('../utility').statistics;

function MADataPvd(dataPvd, N) {
    HistoryDataPvd.call(this, dataPvd, N);
}

MADataPvd.prototype = Object.create(HistoryDataPvd.prototype);

MADataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    var data = HistoryDataPvd.prototype.get.call(this, ts);
    return statistics.mean(data);
}
