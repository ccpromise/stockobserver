
var taskCol = require('../dispatcher/handlers/task/db').taskCol;
var lastSyncDateCol = require('../dispatcher/handlers/task/db').lastSyncDateCol;
var simulate = require('../dispatcher/handlers/simulate/db');
var trade = require('../dispatcher/handlers/trade/db').tradeplanCol;
var simulateCol = simulate.simulateCol;
var simdateCol = simulate.simdateCol;
var ObjectId = require('mongodb').ObjectId;


Promise.all([taskCol.find({}), lastSyncDateCol.find({}), simulateCol.find({}), simdateCol.find({})]).then((arr) => {
    arr.forEach((r) => {
        console.log(r)
    });
});


//taskCol.find({}).then(console.log);
