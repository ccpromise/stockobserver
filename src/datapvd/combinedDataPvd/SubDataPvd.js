
var CombinedDataPvd = require('./CombinedDataPvd');

function SubDataPvd(pvds, domainIdx) {
    CombinedDataPvd.call(this, pvds, domainIdx);
}

SubDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

SubDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.slice(1).reduce((pre, cur) => { return pre - cur.get(ts); }, this.pvds[0].get(ts));
}

module.exports = SubDataPvd;
