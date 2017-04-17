
var netease = require('../../../src/node_modules/datasrc/node_modules/netease');

netease.getRtStockData().then((data) => console.log(data.list.length)).catch(err => console.log(err));
