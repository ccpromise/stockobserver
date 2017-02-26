
module.exports = StdDataPvd;

var HistoryDataPvd = require('./HistoryDataPvd');
var statistics = require('../utility').statistics;

function StdDataPvd(dataPvd, N) {
    HistoryDataPvd.call(this, dataPvd, N);
}

StdDataPvd.prototype = Object.create(HistoryDataPvd.prototype);

StdDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Exception('invalid ts');
    var data = HistoryDataPvd.prototype.get.call(this, ts);
    return statistics.std(data);
}
