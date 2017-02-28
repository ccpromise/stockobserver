
var CachedDataPvd = require('../basicDataPvd/CachedDataPvd');

function StatDataPvd(pvd, N) {
    CachedDataPvd.call(this);

    this.minTs = pvd.forwardDateTs(pvd.minTs, N-1);
    this.maxTs = this.minTs == -1 ? -1 : pvd.maxTs;
    this.pvd = pvd;
    this.N = N;
}

StatDataPvd.prototype = Object.create(CachedDataPvd.prototype);

StatDataPvd.prototype.hasDef = function(ts) {
    return ts >= this.minTs && ts <= this.maxTs && this.pvd.hasDef(ts);
}

StatDataPvd.prototype.forwardDateTs = function(ts, n) {
    var fwTs = this.pvd.forwardDateTs(ts, n);
    return this.hasDef(fwTs) ? fwTs : -1;
}

StatDataPvd.prototype.backwardDateTs = function(ts, n) {
    var bwTs = this.pvd.backwardDateTs(ts, n);
    return this.hasDef(bwTs) ? bwTs : -1;
}

module.exports = StatDataPvd;
