
msg = 'Not Implemented';

function DataPvd() {
    this.minTs = -1;
    this.maxTs = -1;
}

DataPvd.prototype.hasDef = function(ts) {
    throw new Error(msg);
}

DataPvd.prototype.get = function(ts) {
    throw new Error(msg);
}

DataPvd.prototype.forwardDateTs = function(ts, n) {
    throw new Error(msg);
}

DataPvd.prototype.backwardDateTs = function(ts, n) {
    throw new Error(msg);
}

module.exports = DataPvd;
