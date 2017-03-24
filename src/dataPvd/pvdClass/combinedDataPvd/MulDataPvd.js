
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

module.exports = pvdGenerator(MulDataPvd, 'mul');
