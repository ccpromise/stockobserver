
var StockDataPvd = require('./StockDataPvd');

function EndDataPvd(stock) {
    StockDataPvd.call(this, stock);
}

EndDataPvd.prototype = Object.create(StockDataPvd.prototype);

EndDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.stock[ts]['e'];
}

module.exports = EndDataPvd;
