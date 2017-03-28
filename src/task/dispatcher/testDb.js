
var taskCol = require('./taskManager/db').taskCol;
var syncdateCol = require('./updateStockData/db').syncdateCol;
var simulate = require('./simulate/db');
var trade = require('./trade/db').tradeplanCol;
var simulateCol = simulate.simulateCol;
var lastSimDateCol = simulate.lastSimDateCol;
var tradePlan = require('../../strategy/tradeplan');

Promise.all([taskCol.find({}), syncdateCol.find({}), simulateCol.find({}), lastSimDateCol.find({})]).then((arr) => {
    arr.forEach(console.log);
});
