
var CombinedDataPvd = require('./CombinedDataPvd');

function DivDataPvd(pvds, domainIdx) {
    CombinedDataPvd.call(this, pvds, domainTs);
}

DivDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

DivDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.slice(1).reduce((pre, cur) => { return pre / cur.get(ts); }, this.pvds[0].get(ts));
}

module.exports = DivDataPvd;
