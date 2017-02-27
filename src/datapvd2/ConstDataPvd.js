
var DataPvd = require('./DataPvd');

function ConstDataPvd(obj) {
    DataPvd.call(this);
    this.minTs = -Infinity;
    this.maxTs = Infinity;
    this.obj = obj;
}

ConstDataPvd.prototype = Object.create(DataPvd.prototype);

ConstDataPvd.prototype.hasDef = function(ts) {
    return true;
}

ConstDataPvd.prototype.get = function(ts) {
    return this.obj;
}

module.exports = ConstDataPvd;
