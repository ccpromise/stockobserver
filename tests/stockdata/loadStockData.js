
var loadStockData = require('../../src/stockdata').loadStockData;
var time = require('../../src/utility').time;
var assert = require('assert');

loadStockData('000001.XSHE').then((data) => {console.log(data);}).catch((err) => { console.log('find error!', err);});

assert.equal(time.getDateTs('20000104'), 10991);
assert.equal(time.getDateTs('20170227'), 17252);
