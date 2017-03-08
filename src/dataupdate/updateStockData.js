var getStockList = require('./getStockList');
var config = require('../config');
var stockDir = config.stockDataDir;
var parallelRequestN = config.parallelRequestN;
var utility = require('../utility');
var file = utility.file;
var time = utility.time;
var async = utility.async;
var path = require('path');
var getHistoryData = require('../datasrc/wmcloud').getHistoryData;

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
        var i = 0;
        var len = stockList.length;

        return async.parallelPromise(() => {
            return i < len;
        }, () => {
            var j = i;
            i ++;
            return Promise.resolve().then(() => {
                var secID = stockList[j];
                var filePath = path.join(stockDir, secID + '.json');
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
                }).then((data) => {
                    return file.writeFile(filePath, JSON.stringify(data)).then(() => console.log(secID, ' updated'));
                });
            }).catch((err) => { console.log(stockList[j], ' error: ', err.message); });
        }, parallelRequestN);

        /* version1 for while
        var i = 0;
        var len = stockList.length;

        return async.promiseWhile(() => {
            return i < len;
        }, () => {
            return Promise.resolve().then(() => {
                var secID = stockList[i];
                var filePath = path.join(stockDir, secID + '.json');
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
                }).then((data) => {
                    console.log(data);
                    console.log(secID, ' updated');
                    return file.writeFile(filePath, JSON.stringify(data));
                });
            }).catch((err) => { console.log(stockList[i], ' error: ', err.message); }).then(() => i++);
        });
        */
        /* version 2 for while
        var iterator = function(secID) {
            var filePath = path.join(stockDir, secID + '.json');
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
            }).then((data) => {
                console.log(secID, ' updated');
                return file.writeFile(filePath, JSON.stringify(data));
            }, (err) => {
                console.log(secID, ' error: ', err.message);
            });
        }
        return async.whileAsync(stockList, iterator);
        */
    });
}

module.exports = updateStockData;
