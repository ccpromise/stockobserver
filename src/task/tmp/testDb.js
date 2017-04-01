
var taskCol = require('../dispatcher/taskManager/db').taskCol;
var producedateCol = require('../dispatcher/taskManager/db').producedateCol;
var simulate = require('../dispatcher/simulate/db');
var trade = require('../dispatcher/trade/db').tradeplanCol;
var simulateCol = simulate.simulateCol;
var simdateCol = simulate.simdateCol;
var tradePlan = require('../../strategy/tradeplan');
var ObjectId = require('mongodb').ObjectId;


Promise.all([taskCol.find({}), producedateCol.find({}), simulateCol.find({}), simdateCol.find({})]).then((arr) => {
    arr.forEach((r) => {
        console.log(r)
    });
    var res = arr[2];
    console.log(res);
});


//taskCol.find({}).then(console.log);
