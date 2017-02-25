
exports.DataPvd = DataPvd;

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
    if(!this.hasDef(ts)) return 'invalid ts';
    return this.getData(this.stock[ts]);
}
