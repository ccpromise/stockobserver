
var CombinedDataPvd = require('./CombinedDataPvd');
var pvdGenerator = require('./combinedPvdGenerator');

function AndDataPvd(pvds, idx, id) {
    CombinedDataPvd.call(this, pvds, idx, id);
}

AndDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

AndDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.reduce((pre, cur) => pre && cur.get(ts), true);
}

module.exports = pvdGenerator(AndDataPvd, 'and');
