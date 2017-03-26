
var taskCol = require('./taskManager/db').taskCol;
var syncdateCol = require('./updateStockData/db').syncdateCol;
var simulate = require('./simulate/db');
var simulateCol = simulate.simulateCol;
var lastSimDateCol = simulate.lastSimDateCol;

Promise.all([taskCol.remove(), syncdateCol.remove(), simulateCol.remove(), lastSimDateCol.remove()]).then(() => {
    console.log('done');
})
