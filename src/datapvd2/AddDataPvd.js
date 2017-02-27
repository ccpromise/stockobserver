
var BinaryDataPvd = require('./BinaryDataPvd');

function AddDataPvd(pvd1, pvd2) {
    BinaryDataPvd.call(this, pvd1, pvd2);
}

AddDataPvd.prototype = Object.create(BinaryDataPvd.prototype);

AddDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return this.pvd1.get(ts) + this.pvd2.get(ts);
}

module.exports = AddDataPvd;
