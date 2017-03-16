
var stockDir = require('../config').stockDataDir;
var utility = require('../utility');
var file = utility.file;
var time = utility.time;
var path = require('path');
var getHistoryData = require('../datasrc/wmcloud').getHistoryData;

module.exports = function(secID) {
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
