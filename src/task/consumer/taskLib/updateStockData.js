
var utility = require('../../../utility');
var time = utility.time;
var azure = utility.azureStorage;
var validate = utility.validate;
var getHistoryData = require('../../../datasrc/wmcloud').getHistoryData;
var container = require('../../../config').stockdataContainer;

exports.run = function(secID) {
    secID = secID.toLowerCase();
    return azure.createContainerIfNotExists(container).then(() => {
        azure.getBlobToText(container, secID + '.json').then((stockData) => {
            stockData = JSON.parse(stockData);
            var nextDay = time.nextDay(stockData.maxDay);
            return getHistoryData(secID, time.format(nextDay, 'YYYYMMDD')).then((newData) => {
                var adjFactor = stockData.data[stockData.maxDay] / newData.preClosePrice;
                stockData.maxDay = time.format(newData.maxDay, 'YYYYMMDD');
                for(date in newData.data) {
                    stockData.data[date] = newData.data[date] * adjFactor;
                }
                return stockData;
            });
        }, (err) => {
            if(err.code === 'BlobNotFound') {
                return getHistoryData(secID).then((data) => {
                    delete data.preClosePrice;
                    return data;
                })
            }
            throw err;
        }).then((data) => {
            return azure.createBlobFromText(container, secID + '.json', JSON.stringify(data)).then((r) => {
                console.log('write to blob done.');
            });
        });
    })
}

exports.checkArgs = function(arg) {
    return validate.isStr(arg);
}
