
var dbs = require('../dispatcher/handlers');
var taskCol = dbs.task.db.taskCol;
var lastSyncDateCol = dbs.task.db.lastSyncDateCol;
var simulateCol = dbs.simulate.db.simulateCol;
var simdateCol = dbs.simulate.db.simdateCol;

Promise.all([taskCol.remove(), lastSyncDateCol.remove(), simulateCol.remove(), simdateCol.remove()]).then(() => {
    console.log('done');
});
