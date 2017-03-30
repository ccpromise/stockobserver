
var taskCol = require('./taskManager/db').taskCol;
var producedateCol = require('./taskManager/db').producedateCol;
var simulate = require('./simulate/db');
var trade = require('./trade/db').tradeplanCol;
var simulateCol = simulate.simulateCol;
var simdateCol = simulate.simdateCol;
var tradePlan = require('../../strategy/tradeplan');

Promise.all([trade.remove().then(() => { return trade.insertMany(Object.values(tradePlan)); }), taskCol.remove(), producedateCol.remove(), simulateCol.remove(), simdateCol.remove()]).then(() => {
    console.log('done');
});
