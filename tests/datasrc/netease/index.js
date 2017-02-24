
var netease = require('../../../src/datasrc/netease');

netease.getStockData().then((data) => console.log(data)).catch(err => console.log(err.message));
