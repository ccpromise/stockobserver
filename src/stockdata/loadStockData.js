
var dir = require('../config').stockDataDir;
var file = require('../utility').file;
var path = require('path');
var cleanData = require('./cleanData');

function loadStockData(secID) {
    var fileName = secID + '.json';
    return file.readFile(path.join(dir, fileName)).then((data) => {
        data = JSON.parse(data.toString());
        cleanData(data);
        return data;
    })
}

module.exports = loadStockData;
