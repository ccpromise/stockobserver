
var stockDir = require('../../config').stockDataDir;
var utility = require('../../utility');
var file = utility.file;
var time = utility.time;
var path = require('path');
var getHistoryData = require('../../datasrc/wmcloud').getHistoryData;
var azure = require('../../utility').azureStorage;
var container = require('../../config').stockdataContainer;

module.exports = function(secID) {
    secID = secID.toLowerCase();
    return azure.getBlobToText(container, secID + '.json').then((stockData) => {
        stockData = JSON.parse(stockData);
        var nextDay = time.nextDay(time.createDate(stockData.maxDay));
        return getHistoryData(secID, time.format(nextDay, 'YYYYMMDD')).then((newData) => {
            stockData.maxDay = time.format(newData.maxDay, 'YYYYMMDD');
            for(date in newData.data) {
                var formatDate = time.format(date, 'YYYYMMDD');
                stockData.data[formatDate] = newData.data[date];
            }
            return stockData;
        });
    }, (err) => {
        if(err.code === 'BlobNotFound') {
            return getHistoryData(secID);
        }
        throw err;
    }).then((data) => {
        return azure.createBlobFromText(container, secID + '.json', JSON.stringify(data)).then((r) => {
            console.log('write to blob done.');
        });
    });
}
