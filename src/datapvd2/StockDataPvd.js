
var DataPvd = require('./DataPvd');
var time = require('../utility').time;

function StockDataPvd(stock) {
    DataPvd.call(this); //*

    var min = time.getDateTs(time.now());
    var max = -1;
    for(ts in stock) {
        var n = Number(ts);
        min = Math.min(min, n);
        max = Math.max(max, n);
    }
    this.stock = stock;
    this.minTs = max == -1 ? -1 : min;
    this.maxTs = max;
}

StockDataPvd.prototype = Object.create(DataPvd.prototype);

StockDataPvd.prototype.hasDef = function(ts) {
    return ts in this.stock && ts >= this.minTs && ts <= this.maxTs;
}

StockDataPvd.prototype.forwardDateTs = function(ts, n) {
    return this._nearValidTs(ts, n);
}

StockDataPvd.prototype.backwardDateTs = function(ts, n) {
    return this._nearValidTs(ts, -n);
}

// n > 0, forward; n < 0, backward
StockDataPvd.prototype._nearValidTs = function(ts, n) {
    var isForward = n > 0;
    ts = this._nearestValidTs(ts, isForward);
    n = Math.abs(n);
    while(n > 0 && ts !== -1) {
        ts = this._nearestValidTs(isForward ? ++ts : --ts, isForward);
        n--;
    }
    return ts;
}

// if ts is valid, return ts. else return the next/previous valid ts
StockDataPvd.prototype._nearestValidTs = function(ts, isForward) {
    while(ts >= this.minTs && ts <= this.maxTs && !(ts in this.stock))
        isForward ? ts++ : ts--;
    return ts in this.stock ? ts : -1;
}

module.exports = StockDataPvd;
