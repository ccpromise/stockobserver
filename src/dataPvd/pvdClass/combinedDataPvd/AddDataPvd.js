
var CombinedDataPvd = require('./CombinedDataPvd');
var pvdGenerator = require('./combinedPvdGenerator');

function AddDataPvd(pvds, domainIdx, id) {
    CombinedDataPvd.call(this, pvds, domainIdx, id);
}

AddDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

AddDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts' + ts);
    return this.pvds.reduce((pre, cur) => { return pre + cur.get(ts); }, 0);
}

module.exports = pvdGenerator(AddDataPvd, 'add');
