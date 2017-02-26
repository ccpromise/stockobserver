
module.exports = DataPvd;

var time = require('../utility').time;

function DataPvd(stock, getData) {
    var min = time.getDateTs(time.now());
    var max = -1;
    for(ts in stock) {
        var n = Number(ts);
        min = Math.min(min, n);
        max = Math.max(max, n);
    }
    this.stock = stock;
    this.getData = getData;
    this.minTs = max == -1 ? -1 : min;
    this.maxTs = max;
}

DataPvd.prototype.hasDef = function(ts) {
    return ts in this.stock && ts >= this.minTs && ts <= this.maxTs;
}

DataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return this.getData(this.stock[ts]);
}

DataPvd.prototype.forwardDateTs = function(ts, n) {
    return this.nearValidTs(ts, n);
}

DataPvd.prototype.backwardDateTs = function(ts, n) {
    return this.nearValidTs(ts, -n);
}

// n > 0, forward; n < 0, backward
DataPvd.prototype.nearValidTs = function(ts, n) {
    var isForward = n > 0;
    ts = this.nearestValidTs(ts, isForward);
    n = Math.abs(n);
    while(n > 0 && ts !== -1) {
        ts = this.nearestValidTs(isForward ? ++ts : --ts, isForward);
        n--;
    }
    return ts;
}

// if ts is valid, return ts. else return the next/previous valid ts
DataPvd.prototype.nearestValidTs = function(ts, isForward) {
    while(ts >= this.minTs && ts <= this.maxTs && !(ts in this.stock))
        isForward ? ts++ : ts--;
    return ts in this.stock ? ts : -1;
}
