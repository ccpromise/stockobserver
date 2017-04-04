
var dbs = require('../dispatcher/handlers');
var taskCol = dbs.task.db.taskCol;
var producedateCol = dbs.task.db.producedateCol;
var simulateCol = dbs.simulate.db.simulateCol;
var simdateCol = dbs.simulate.db.simdateCol;

Promise.all([taskCol.remove(), producedateCol.remove(), simulateCol.remove(), simdateCol.remove()]).then(() => {
    console.log('done');
});
