
var CombinedDataPvd = require('./CombinedDataPvd');
var pvdGenerator = require('./combinedPvdGenerator');

function GtDataPvd(pvds, idx, id) {
    CombinedDataPvd.call(this, pvds, idx, id);
}

GtDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

GtDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds[0].get(ts) > this.pvds[1].get(ts);
}

module.exports = pvdGenerator(GtDataPvd, 'gt');
