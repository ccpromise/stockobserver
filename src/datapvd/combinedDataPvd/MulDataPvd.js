
var CombinedDataPvd = require('./CombinedDataPvd');

function MulDataPvd(pvds, domainTs) {
    CombinedDataPvd.call(this, pvds, domainTs);
}

MulDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

MulDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.reduce((pre, cur) => { pre *= cur.get(ts); return pre; }, 1);
}

module.exports = MulDataPvd;
