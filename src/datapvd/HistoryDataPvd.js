
var DataPvd = require('./DataPvd');
module.exports = HistoryDataPvd;

function HistoryDataPvd(dataPvd, N) {
    this.dataPvd = dataPvd;
    this.stock = dataPvd.stock;
    this.N = N;
    this.realMinTs = dataPvd.minTs;
    this.realMaxTs = dataPvd.maxTs;
    this.minTs =  dataPvd.forwardDateTs(this.realMinTs, N-1);
    this.maxTs = this.minTs == -1 ? -1 : this.realMaxTs;
}

HistoryDataPvd.prototype = Object.create(DataPvd.prototype);

HistoryDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.dataPvd.get(ts));
        ts = this.dataPvd.backwardDateTs(ts, 1);
        n--;
    }
    return data;
}
