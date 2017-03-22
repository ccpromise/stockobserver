
var azure = require('../utility').azureStorage;
var container = require('../config').stockdataContainer;
var cleanData = require('./cleanData');

function loadStockData(secID) {
    return azure.getBlobToText(container, secID + '.json').then((r) => {
        var data = JSON.parse(r);
        cleanData(data);
        return data;
    });
}

module.exports = loadStockData;
