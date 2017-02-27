

var BinaryDataPvd = require('./BinaryDataPvd');

function MulDataPvd(pvd1, pvd2) {
    BinaryDataPvd.call(this, pvd1, pvd2);
}

MulDataPvd.prototype = Object.create(BinaryDataPvd.prototype);

MulDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return this.pvd1.get(ts) + this.pvd2.get(ts);
}

module.exports = MulDataPvd;
