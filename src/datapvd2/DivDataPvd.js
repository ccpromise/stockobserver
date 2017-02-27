
var BinaryDataPvd = require('./BinaryDataPvd');

function DivDataPvd(pvd1, pvd2) {
    BinaryDataPvd.call(this, pvd1, pvd2);
}

DivDataPvd.prototype = Object.create(BinaryDataPvd.prototype);

DivDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return this.pvd1.get(ts) + this.pvd2.get(ts);
}

module.exports = DivDataPvd;
