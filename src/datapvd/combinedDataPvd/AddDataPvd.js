
var CombinedDataPvd = require('./CombinedDataPvd');

function AddDataPvd(pvds, domainIdx) {
    CombinedDataPvd.call(this, pvds, domainIdx);
}

AddDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

AddDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.reduce((pre, cur) => { return pre + cur.get(ts); }, 0);
}

module.exports = AddDataPvd;
