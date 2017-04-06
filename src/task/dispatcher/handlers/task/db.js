
/**
 * task/db:
 * taskCol: maintain all the tasks, including task literal, status, readyCondition, lastProcessingTime and log.
 * lastSyncDateCol: maintain the latest task produce date.
 */
const db = require('../db');

exports.taskCol = db.getCollection('taskCol', {
    'task': true,
    'status': true,
    'readyCondition': true,
    'lastProcessingTime': true,
    'log': true
});

exports.lastSyncDateCol = db.getCollection('lastSyncDateCol', {
    'secID': true,
    'lastSyncDate': true
});
