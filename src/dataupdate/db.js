
var utility = require('../utility');
var config = require('../config');
var Database = utility.database;
var time = utility.time;
var mongoUrl = config.mongoUrl;
var taskStatus = config.constants.taskStatus;
var maxTaskDuration = config.maxTaskDuration;

var db = new Database(mongoUrl);
var syncDate = db.getCollection('syncDate', { 'secID': true, 'syncDate': true });
var task = db.getCollection('task', { 'secID': true, 'status': true, 'time': true, 'log': true });

syncDate.updateSyncDate = function(idArr) {
    return syncDate.updateMany({ 'secID': { $in: idArr } }, { $set: { 'syncDate': time.today() } });
}

task.clearTimeout = function() {
    return task.update({
        'status': taskStatus.processing, 'time': { $lt: time.valueOf(time.now()) - maxTaskDuration }
    }, {
        $set: { 'status': taskStatus.ready, 'time': time.valueOf(time.now()) },
        $push: { 'log': {
            'desc': 'task time out',
            'time': time.now(),
            'err': new Error('task time out')
        }}
    }).catch((err) => {
        console.log(err);
    });
}

task.insertTask = function(idArr) {
    var buildTask = function(id) {
        return {
            'secID': id,
            'status': taskStatus.processing,
            'time': time.valueOf(time.now()),
            'log': [{
                'desc': 'build new',
                'time': time.now(),
                'err': null
            }]
        }
    }
    return task.insertMany(idArr.map(buildTask));
}

exports.syncDate = syncDate;
exports.task = task;
exports.database = db;
