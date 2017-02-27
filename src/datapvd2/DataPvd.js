
var msg = 'Not Implemented';

function DataPvd() {
    this.minTs = -1;
    this.maxTs = -1;
}

DataPvd.prototype.hasDef = function(ts) {
    throw msg;
}

DataPvd.prototype.get = function(ts) {
    throw msg;
}

DataPvd.prototype.forwardDateTs = function(ts, n) {
    throw msg;
}

DataPvd.prototype.backwardDateTs = function(ts, n) {
    throw msg;
}

module.exports = DataPvd;
