
var CachedDataPvd = require('./CachedDataPvd');

function CachedStatDataPvd(pvd, N) {
    CachedDataPvd.call(this);

    this.minTs = pvd.forwardDateTs(pvd.minTs, N-1);
    this.maxTs = this.minTs == -1 ? -1 : pvd.maxTs;
    this.pvd = pvd;
    this.N = N;
}

CachedStatDataPvd.prototype = Object.create(CachedDataPvd.prototype);

CachedStatDataPvd.prototype.hasDef = function(ts) {
    return ts >= this.minTs && ts <= this.maxTs && this.pvd.hasDef(ts);
}

CachedStatDataPvd.prototype.forwardDateTs = function(ts, n) {
    var fwTs = this.pvd.forwardDateTs(ts, n);
    return this.hasDef(fwTs) ? fwTs : -1;
}

CachedStatDataPvd.prototype.backwardDateTs = function(ts, n) {
    var bwTs = this.pvd.backwardDateTs(ts, n);
    return this.hasDef(bwTs) ? bwTs : -1;
}

module.exports = CachedStatDataPvd;
