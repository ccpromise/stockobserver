
exports.HistoryDataPvd = HistoryDataPvd;

HistoryDataPvd.prototype.getNearTs = function(ts, n) {
    var inc = n > 0 ? 1 : -1;
    while(ts+inc >= this.realMinTs && ts+inc <= this.realMaxTs && n != 0) {
        ts += inc;
        while(!this.dataPvd.hasDef(ts)) ts += inc;
        n -= inc;
    }
    return n == 0 ? ts : -1;
}

function HistoryDataPvd(dataPvd, N) {
    this.dataPvd = dataPvd;
    this.N = N;
    this.realMinTs = dataPvd.minTs;
    this.realMaxTs = dataPvd.maxTs;
    this.minTs = this.getNearTs(this.realMinTs, N-1);
    this.maxTs = this.minTs == -1 ? -1 : this.realMaxTs;
}

HistoryDataPvd.prototype.hasDef = function(ts) {
    return this.dataPvd.hasDef(ts);
}

HistoryDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.dataPvd.get(ts));
        ts = this.getNearTs(ts, -1);
        n--;
    }
    return data;
}
