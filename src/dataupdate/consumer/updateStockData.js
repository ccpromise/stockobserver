
var stockDir = require('../../config').stockDataDir;
var utility = require('../../utility');
var file = utility.file;
var time = utility.time;
var path = require('path');
var getHistoryData = require('../../datasrc/wmcloud').getHistoryData;

module.exports = function(secID) {
    var filePath = path.join(stockDir, secID + '.json');
    return file.readFile(filePath).then((stockData) => {
        stockData = JSON.parse(stockData.toString());
        var nextDay = time.nextDay(time.createDate(stockData.maxDay));
        return getHistoryData(secID, time.format(nextDay, 'YYYYMMDD')).then((newData) => {
            stockData.maxDay = time.format(newData.maxDay, 'YYYY-MM-DD'); 
            for(date in newData.data) {
                var formatDate = time.format(date, 'YYYY-MM-DD');
                stockData.data[formatDate] = newData.data[date];
            }
            return stockData;
        });
    }, (err) => {
        if(err.code === 'ENOENT') {
            return getHistoryData(secID);
        }
        throw err;
    }).then((data) => {
        return file.writeFile(filePath, JSON.stringify(data));
    });
}
