var getStockList = require('./getStockList');
var stockDir = require('../config').stockDataDir;
var utility = require('../utility');
var file = utility.file;
var time = utility.time;
var path = require('path');
var getHistoryData = require('../datasrc/wmcloud').getHistoryData;

function updateStockData() {
    return new Promise((resolve, reject) => {
        getStockList().then((stockList) => {
            var promises = stockList.map((secID) => {
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
                    })
                }, (err) => {
                    if(err.code === 'ENOENT') {
                        return getHistoryData(secID);
                    }
                    else throw err;
                }).then((data) => {
                    return file.writeFile(filePath, JSON.stringify(data)).then(() => console.log(secID, ' updated'));
                }).catch((err) => { console.log(secID, ' error: ', err.message)});
            });
            return Promise.all(promises);
        }).then(resolve).catch(reject);
    });
}

module.exports = updateStockData;
