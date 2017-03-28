
var config = require('../config');
var useLocalData = config.useLocalData;
var stockDir = config.stockDataDir;
var path = require('path');
var utility = require('../utility');
var file = utility.file;
var azure = require('../utility/azureStorage')(config.azureUsr);
var container = config.stockdataContainer;
var cleanData = require('./cleanData');

function loadStockData(secID) {
    secID = secID + '.json';
    return (useLocalData
    ? file.readFile(path.join(stockDir, secID))
    : azure.getBlobToText(container, secID)).then((r) => {
        var data = JSON.parse(r);
        cleanData(data);
        return data;
    })
}

module.exports = loadStockData;
