
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

ConstDataPvd.prototype.forwardDateTs = function(ts, n) {
    return ts + n;
}

ConstDataPvd.prototype.backwardDateTs = function(ts, n) {
    return ts - n;
}

module.exports = ConstDataPvd;
