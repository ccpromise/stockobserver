
var StockDataPvd = require('./StockDataPvd');
var loadStockData = require('../../stockData').loadStockData;
var utility = require('../../utility');
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

function checkParas(paraObj) {
    return validate.isStr(paraObj['secID']) && object.numOfKeys(paraObj) === 1;
}

function pvdID(paraObj) {
    return 'end' + '_' + paraObj['secID'];
}

function makePvd(paraObj, id) {
    return loadStockData(paraObj['secID']).then((stock) => { return new EndDataPvd(stock, id); });
}

module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
