
var DataPvd = require('../basicDataPvd').DataPvd;

function CombinedDataPvd(pvds, domainIdx, id) {
    DataPvd.call(this, id);
    this.minTs = pvds[domainIdx].minTs
    this.maxTs = pvds[domainIdx].maxTs;
    this.pvds = pvds;
    this.domainIdx = domainIdx;
}

CombinedDataPvd.prototype = Object.create(DataPvd.prototype);

CombinedDataPvd.prototype.hasDef = function(ts) {
    return this.pvds[this.domainIdx].hasDef(ts);
}

CombinedDataPvd.prototype.forwardDateTs = function(ts, n) {
    return this.pvds[this.domainIdx].forwardDateTs(ts, n);
}

CombinedDataPvd.prototype.backwardDateTs = function(ts, n) {
    return this.pvds[this.domainIdx].backwardDateTs(ts, n);
}

module.exports = CombinedDataPvd;
