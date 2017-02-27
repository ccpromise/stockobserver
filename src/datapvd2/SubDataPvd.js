
var BinaryDataPvd = require('./BinaryDataPvd');

function SubDataPvd(pvd1, pvd2) {
    BinaryDataPvd.call(this, pvd1, pvd2);
}

SubDataPvd.prototype = Object.create(BinaryDataPvd.prototype);

SubDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts'+ts;
    return this.pvd1.get(ts) - this.pvd2.get(ts);
}

module.exports = SubDataPvd;
