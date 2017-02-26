
module.exports = OffsetDataPvd;

function OffsetDataPvd(pvd, n) {
    if(n > 0) {
        this.maxTs = pvd.backwardDateTs(pvd.maxTs, n);
        this.minTs = this.maxTs === -1 ? -1 : pvd.minTs;
    }
    if(n < 0) {
        this.minTs = pvd.forwardDateTs(pvd.minTs, n);
        this.maxTs = this.minTs === -1 ? -1 : pvd.maxTs;
    }
    this.n = n;
    this.pvd = pvd;
}

OffsetDataPvd.prototype.hasDef = function(ts) {
    return this.pvd.hasDef(this.pvd.nearValidTs(ts, thi.n));
}

OffsetDataPvd.prototype.get = function(ts) {
    var actualTs = this.pvd.nearValidTs(ts, this.n);
    if(!this.pvd.hasDef(actualTs)) throw 'invalid ts';
    return this.pvd.get(actualTs);
}
