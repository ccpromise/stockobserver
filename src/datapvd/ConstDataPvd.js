
var time = require('../utility').time;

function ConstDataPvd(obj) {
    this.obj = obj;
}

ConstDataPvd.prototype.minTs = 0;
ConstDataPvd.prototype.maxTs = time.getDateTs(time.now());
ConstDataPvd.prototype.hasDef = function() { return true; }
ConstDataPvd.prototype.get = function() { return this.obj; }

module.exports = ConstDataPvd;
