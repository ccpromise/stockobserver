
var taskCol = require('./taskManager/db').taskCol;
var syncdateCol = require('./updateStockData/db').syncdateCol;
var simulate = require('./simulate/db');
var trade = require('./trade/db').tradeplanCol;
var simulateCol = simulate.simulateCol;
var lastSimDateCol = simulate.lastSimDateCol;
var config = require('../../config');
var azure = require('../../utility').azureStorage(config.azureUsr);
var container = config.stockdataContainer;
var tradePlan = require('../../strategy/tradeplan');


Promise.all([trade.remove().then(() => { return trade.insertMany(Object.values(tradePlan)); }), taskCol.remove(), syncdateCol.remove(), simulateCol.remove(), lastSimDateCol.remove(), azure.deleteContainer(container)]).then(() => {
    console.log('done');
});
