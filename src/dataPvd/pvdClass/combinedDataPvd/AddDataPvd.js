
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

module.exports = {
    'checkParams': pvdGenerator.checkParams,
    'pvdID': (paramObj) => { return pvdGenerator.pvdID(paramObj, 'add'); },
    'makePvd': (paramObj, id) => { return pvdGenerator.makePvd(paramObj, id, AddDataPvd); }
}
