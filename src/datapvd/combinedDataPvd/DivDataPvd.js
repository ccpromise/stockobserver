
var CombinedDataPvd = require('./CombinedDataPvd');

function DivDataPvd(pvds, domainIdx) {
    CombinedDataPvd.call(this, pvds, domainTs);
}

DivDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

DivDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.reduce((pre, cur) => { pre /= cur.get(ts); return pre; }, Math.pow(this.pvds[0].get(ts), 2));
}

module.exports = DivDataPvd;
