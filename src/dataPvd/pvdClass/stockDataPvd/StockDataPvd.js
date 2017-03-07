
var DataPvd = require('../basicDataPvd/DataPvd');
var time = require('../../../utility').time;

function StockDataPvd(stock, id) {
    DataPvd.call(this, id); //*

    this.stock = stock.data;
    this.minTs = stock.minTs;
    this.maxTs = stock.maxTs;
    this._sortedTs = [];
    var idx = 0;
    for(var ts = this.minTs; ts <= this.maxTs; ts ++) {
        if(ts in this.stock) {
            this._sortedTs.push(ts);
            this.stock[ts]['idx'] = idx++;
        }
    }
}

StockDataPvd.prototype = Object.create(DataPvd.prototype);

StockDataPvd.prototype.hasDef = function(ts) {
    return ts in this.stock && ts >= this.minTs && ts <= this.maxTs;
}

StockDataPvd.prototype.forwardDateTs = function(ts, n) {
    while(!(ts in this.stock) && ts <= this.maxTs) ts++;
    if(!(ts in this.stock)) return -1;
    var idx = this.stock[ts]['idx'];
    return idx + n < this._sortedTs.length ? this._sortedTs[idx+n] : -1;
}

StockDataPvd.prototype.backwardDateTs = function(ts, n) {
    while(!(ts in this.stock) && ts >= this.minTs) ts--;
    if(!(ts in this.stock)) return -1;
    var idx = this.stock[ts]['idx'];
    return idx - n >= 0 ? this._sortedTs[idx-n] : -1;
}

module.exports = StockDataPvd;
