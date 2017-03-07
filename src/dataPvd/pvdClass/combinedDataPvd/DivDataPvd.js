
var CombinedDataPvd = require('./CombinedDataPvd');
var pvdGenerator = require('./combinedPvdGenerator');

function DivDataPvd(pvds, domainIdx, id) {
    CombinedDataPvd.call(this, pvds, domainIdx, id);
}

DivDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

DivDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.slice(1).reduce((pre, cur) => { return pre / cur.get(ts); }, this.pvds[0].get(ts));
}

module.exports = {
    'checkParams': pvdGenerator.checkParams,
    'pvdID': (paramObj) => { return pvdGenerator.pvdID(paramObj, 'div'); },
    'makePvd': (paramObj, id) => { return pvdGenerator.makePvd(paramObj, id, DivDataPvd); }
}
