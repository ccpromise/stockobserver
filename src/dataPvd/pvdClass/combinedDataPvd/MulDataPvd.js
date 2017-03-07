
var CombinedDataPvd = require('./CombinedDataPvd');
var pvdGenerator = require('./combinedPvdGenerator');

function MulDataPvd(pvds, dmoainIdx, id) {
    CombinedDataPvd.call(this, pvds, dmoainIdx, id);
}

MulDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

MulDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.reduce((pre, cur) => { return pre * cur.get(ts); }, 1);
}

module.exports = {
    'checkParams': pvdGenerator.checkParams,
    'pvdID': (paramObj) => { return pvdGenerator.pvdID(paramObj, 'mul'); },
    'makePvd': (paramObj, id) => { return pvdGenerator.makePvd(paramObj, id, MulDataPvd); }
}
