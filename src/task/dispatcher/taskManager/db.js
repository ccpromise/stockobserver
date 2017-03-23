
var db = require('../db');
var taskCol = db.getCollection('taskCol', { 'task': true, 'status': true, 'lastProcessingTime': true, 'log': true });
var taskStatus = require('../../../constants').taskStatus;
var utility = require('../../../utility');
var time = utility.time;
var config = require('../../../config');
var maxTaskDuration = config.maxTaskDuration;
var ObjectId = require('mongodb').ObjectId;
exports.taskCol = taskCol;

// test
taskCol.remove({});
//taskCol.find({'status': 3}).then((r) => console.log(JSON.stringify(r)));

taskCol.clearTimeout = function() {
    return taskCol.update({
        'status': taskStatus.processing, 'lastProcessedTs': { $lt: time.getTs(time.now()) - maxTaskDuration }
    }, {
        $set: { 'status': taskStatus.ready },
        $push: { 'log': {
            'desc': 'task time out',
            'time': time.format(time.now()),
            'err': new Error('task time out')
        }}
    });
}

taskCol.findReadyTask = function() {
    return taskCol.findAndModify({
        'status': taskStatus.ready
    }, {
        $set: { 'status': taskStatus.processing, 'lastProcessedTs': time.getTs(time.now()) },
        $push: { 'log': {
            'desc': 'task dispatched to a consumer',
            'time': time.format(time.now()),
            'err': null
        }}
    }).then((r) => {
        return r.value === null ? null : {
            'id': r.value._id.toString(),
            'task': r.value.task,
            'lastProcessedTs': r.value.lastProcessedTs
        }
    });
}

taskCol.checkResultValidity = function(result) {
    var id = new ObjectId(result.id);
    return taskCol.findOne({ '_id': id }, { 'lastProcessedTs': true, 'status': true }).then((r) => {
        return r !== null && r.lastProcessedTs === result.lastProcessedTs && r.status === taskStatus.processing;
    });
}
