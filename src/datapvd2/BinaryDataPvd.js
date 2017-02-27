
var DataPvd = require('./DataPvd');

function BinaryDataPvd(pvd1, pvd2) {
    DataPvd.call(this);

    this.minTs = Math.max(pvd1.minTs, pvd2.minTs);
    this.maxTs = Math.min(pvd1.maxTs, pvd2.maxTs);
    if(this.minTs > this.maxTs) {
        this.minTs = -1;
        this.maxTs = -1;
    }
    this.pvd1 = pvd1;
    this.pvd2 = pvd2;
}

BinaryDataPvd.prototype = Object.create(DataPvd.prototype);

BinaryDataPvd.prototype.hasDef = function(ts) {
    return ts >= this.minTs && ts <= this.maxTs && this.pvd1.hasDef(ts);
}

BinaryDataPvd.prototype.forwardDateTs = function(ts, n) {
    var fwTs = this.pvd1.forwardDateTs(ts, n);
    return this.hasDef(fwTs) ? fwTs : -1;
}

BinaryDataPvd.prototype.backwardDateTs = function(ts, n) {
    var bwTs = this.pvd1.backwardDateTs(ts, n);
    return this.hasDef(bwTs) ? bwTs : -1;
}

module.exports = BinaryDataPvd;
