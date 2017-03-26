
var taskCol = require('./taskManager/db').taskCol;
var syncdateCol = require('./updateStockData/db').syncdateCol;
var simulate = require('./simulate/db');
var simulateCol = simulate.simulateCol;
var lastSimDateCol = simulate.lastSimDateCol;
var azure = require('../../utility').azureStorage;
var container = require('../../config').stockdataContainer;

Promise.all([taskCol.remove(), syncdateCol.remove(), simulateCol.remove(), lastSimDateCol.remove(), azure.deleteContainer(container)]).then(() => {
    console.log('done');
})
