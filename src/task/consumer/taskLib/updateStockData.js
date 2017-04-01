
var utility = require('../../../utility');
var config = require('../../../config');
var time = utility.time;
var azure = utility.azureStorage(config.azureUsr);
var validate = utility.validate;
var object = utility.object;
var getHistoryData = require('../../../datasrc/wmcloud').getHistoryData;
var container = config.stockdataContainer;

exports.run = function(secID) {
    return azure.createContainerIfNotExists(container).then(() => {
        return azure.getBlobToText(container, secID + '.json').then((stockData) => {
            stockData = JSON.parse(stockData);
            var nextDay = time.nextDay(stockData.maxDay);
            return getHistoryData(secID, time.format(nextDay, 'YYYYMMDD')).then((newData) => {
                // {data:, minDay:, maxDay:, preClosePrice:}
                var adjFactor = stockData.data[stockData.maxDay].e / newData.preClosePrice;
                stockData.maxDay = time.format(newData.maxDay, 'YYYYMMDD');
                for(date in newData.data) {
                    var adjData = object.clone(newData.data[date]);
                    var price = ['o', 'e', 'h', 'l'];
                    price.forEach((key) => {
                        adjData[key] *= adjFactor;
                    });
                    stockData.data[date] = adjData;
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
            return azure.createBlobFromText(container, secID + '.json', JSON.stringify(data));
        });
    })
}

exports.checkPack = function(arg) {
    return validate.isStr(arg);
}
