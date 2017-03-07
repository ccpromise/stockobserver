
var later = require('later');
var updateStockData = require('./updateStockData');
var updateTime = require('../config').updateTime;
var schedTime = later.parse.text(updateTime);

 module.exports = later.setInterval(updateStockData, schedTime);
