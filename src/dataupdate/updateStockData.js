var getStockList = require('./getStockList');
var config = require('../config');
var stockDir = config.stockDataDir;
var parallelRequest = config.parallelRequest;
var utility = require('../utility');
var file = utility.file;
var time = utility.time;
var path = require('path');
var getHistoryData = require('../datasrc/wmcloud').getHistoryData;
var promisePool = require('./promisePool');
var whileAsync = require('./whileAsync');

/*
function updateStockData() {
    return new Promise((resolve, reject) => {
        getStockList().then((stockList) => {
            return stockList.reduce((pre, secID) => {
                return pre.then(() => {
                    var filePath = path.join(stockDir, secID+'.json');
                    return file.readFile(filePath).then((stockData) => {
                        stockData = JSON.parse(stockData.toString());
                        var nextDay = time.nextDay(stockData.maxDay);
                        return getHistoryData(secID, nextDay).then((newData) => {
                            stockData.maxDay = newData.maxDay;
                            for(date in newData.data) {
                                stockData.data[date] = newData.data[date];
                            }
                            return stockData;
                        });
                    }, (err) => {
                        if(err.code === 'ENOENT') {
                            return getHistoryData(secID);
                        }
                        throw err;
                    })
                }).then((data) => {
                    return file.writeFile(filePath, JSON.stringify(data)).then(() => console.log(secID, ' updated'));
                }).catch((err) => { console.log(secID, ' error: ', err.message) });
            }, Promise.resolve());
        }).then(resolve).catch(reject);
    })
}
*/
function updateStockData() {
    return getStockList().then((stockList) => {
        var promises = stockList.map((secID) => {
            var filePath = path.join(stockDir, secID + '.json');
            return new Promise((resolve, reject) => {
                file.readFile(filePath).then((stockData) => {
                    stockData = JSON.parse(stockData.toString());
                    var nextDay = time.nextDay(stockData.maxDay);
                    return getHistoryData(secID, nextDay).then((newData) => {
                        stockData.maxDay = newData.maxDay;
                        for(date in newData.data) {
                            stockData.data[date] = newData.data[date];
                        }
                        return stockData;
                    });
                }, (err) => {
                    if(err.code === 'ENOENT') {
                        return getHistoryData(secID);
                    }
                    throw err;
                }).then((data) => {
                    return file.writeFile(filePath, JSON.stringify(data)).then(() => resolve(secID));
                }).catch((err) => {
                    reject(secID+' error: '+err.message);
                })
            })
        });
        return whileAsync(promises, (secID) => { console.log(secID, ' updated'); }, (err) => { console.log(err); });
        //return promisePool(promises, (secID) => { console.log(secID, ' updated'); }, (err) => { console.log(err); }, parallelRequest);
    });
}

module.exports = updateStockData;
