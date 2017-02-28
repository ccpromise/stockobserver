
var CombinedDataPvd = require('./CombinedDataPvd');

function SubDataPvd(pvds, domainIdx) {
    CombinedDataPvd.call(this, pvds, domainIdx);
}

SubDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

SubDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.reduce((pre, cur) => { pre -= cur.get(ts); return pre; }, 2 * this.pvds[0].get(ts));
}

module.exports = SubDataPvd;
