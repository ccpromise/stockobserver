
module.exports = BollDataPvd;

var HistoryDataPvd = require('./HistoryDataPvd');
var statistics = require('../utility').statistics;

function BollDataPvd(dataPvd, N) {
    HistoryDataPvd.call(this, dataPvd, N);
}

BollDataPvd.prototype = Object.create(HistoryDataPvd.prototype);

BollDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = HistoryDataPvd.prototype.get.call(this, ts);
    var ma = statistics.mean(data);
    var std = statistics.std(data);
    return {
        'MA': ma,
        'UP': ma + 2 * std,
        'DW': ma - 2 * std,
    }
};
