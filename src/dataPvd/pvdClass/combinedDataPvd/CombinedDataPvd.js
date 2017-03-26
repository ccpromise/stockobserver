
var DataPvd = require('../basicDataPvd').DataPvd;

function CombinedDataPvd(pvds, domainIdx, id, getOp) {
    DataPvd.call(this, id);
    this.minTs = pvds[domainIdx].minTs
    this.maxTs = pvds[domainIdx].maxTs;
    this.pvds = pvds;
    this.domainIdx = domainIdx;
    this.getOp = getOp;
}

CombinedDataPvd.prototype = Object.create(DataPvd.prototype);

CombinedDataPvd.prototype.hasDef = function(ts) {
    return this.pvds[this.domainIdx].hasDef(ts);
}

CombinedDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.map(pvd => pvd.get(ts)).reduce(this.getOp);
}

CombinedDataPvd.prototype.forwardDateTs = function(ts, n) {
    return this.pvds[this.domainIdx].forwardDateTs(ts, n);
}

CombinedDataPvd.prototype.backwardDateTs = function(ts, n) {
    return this.pvds[this.domainIdx].backwardDateTs(ts, n);
}

module.exports = CombinedDataPvd;
