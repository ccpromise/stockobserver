
module.exports = DataCalculatePvd;

function DataCalculatePvd(pvd1, pvd2, operator) {
    this.minTs = Math.max(pvd1.minTs, pvd2.minTs);
    this.maxTs = Math.min(pvd1.maxTs, pvd2.maxTs);
    this.pvd1 = pvd1;
    this.pvd2 = pvd2;
    this.operator = operator;
}

DataCalculatePvd.prototype.hasDef = function(ts) {
    return ts >= this.minTs && ts <= this.maxTs && this.pvd1.hasDef(ts);
}

DataCalculatePvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return this.operator(this.pvd1.get(ts), this.pvd2.get(ts));
}

DataCalculatePvd.prototype.forwardDateTs = function(ts, n) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return this.pvd1.forwardDateTs(ts, n);
}

DataCalculatePvd.prototype.backwardDateTs = function(ts, n) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return this.pvd1.backwardDateTs(ts, n);
}
