
var DataPvd = require('./DataPvd');

function OffsetDataPvd(pvd, N) {
    DataPvd.call(this);
    if(N >= 0) {
        this.maxTs = pvd.backwardDateTs(pvd.maxTs, N);
        this.minTs = this.maxTs == -1 ? -1 : pvd.minTs;
    }
    else {
        this.minTs = pvd.forwardDateTs(pvd.minTs, -N);
        this.maxTs = this.minTs == -1 ? -1 : pvd.maxTs;
    }
    this.N = N;
    this.pvd = pvd;
}

OffsetDataPvd.prototype = Object.create(DataPvd.prototype);

OffsetDataPvd.prototype.hasDef = function(ts) {
    var realTs = this.N > 0 ? this.pvd.forwardDateTs(ts, this.N) : this.pvd.backwardDateTs(ts, -this.N);
    return this.pvd.hasDef(realTs);
}

OffsetDataPvd.prototype.get = function(ts) {
    var realTs = this.N > 0 ? this.pvd.forwardDateTs(ts, this.N) : this.pvd.backwardDateTs(ts, -this.N);
    return this.pvd.get(realTs);
}

OffsetDataPvd.prototype.forwardDateTs = function(ts, n) {
    var realTs = this.N > 0 ? this.pvd.forwardDateTs(ts, this.N) : this.pvd.backwardDateTs(ts, -this.N);
    return this.pvd.forwardDateTs(realTs, n);
}

OffsetDataPvd.prototype.backwardDateTs = function(ts, n) {
    var realTs = this.N > 0 ? this.pvd.forwardDateTs(ts, this.N) : this.pvd.backwardDateTs(ts, -this.N);
    return this.pvd.backwardDateTs(realTs, n);
}

module.exports = OffsetDataPvd;
