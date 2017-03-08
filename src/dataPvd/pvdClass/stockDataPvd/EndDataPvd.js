
var StockDataPvd = require('./StockDataPvd');
var loadStockData = require('../../../stockData').loadStockData;
var utility = require('../../../utility');
var validate = utility.validate;
var object = utility.object;

function EndDataPvd(stock, id) {
    StockDataPvd.call(this, stock, id);
}

EndDataPvd.prototype = Object.create(StockDataPvd.prototype);

EndDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.stock[ts]['e'];
}

function checkParams(secID) {
    return validate.isStr(secID);
}

function pvdID(secID) {
    return 'end' + '_' + secID;
}

var pendingPromise = {};
function makePvd(secID, id) {
    if(!(id in pendingPromise)) {
        var promise = loadStockData(secID).then((stock) => {
            delete pendingPromise[id];
            return new EndDataPvd(stock, id);
        });
        pendingPromise[id] = promise;
    }
    return pendingPromise[id];
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
}
