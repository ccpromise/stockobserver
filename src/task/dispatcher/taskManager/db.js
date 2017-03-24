
// taskCol manages all the task status. it does three things:
// 1. find ready task and return to dispatcher.
// 2. clear time out task.
// 3. accept result from dispatcher, check it and update collection.
var db = require('../db');
var taskCol = db.getCollection('taskCol', { 'task': true, 'status': true, 'lastProcessingTime': true, 'log': true });
var taskStatus = require('../../../constants').taskStatus;
var time = require('../../../utility').time;
var maxTaskDuration = require('../../../config').maxTaskDuration;
var ObjectId = require('mongodb').ObjectId;
exports.taskCol = taskCol;

// init
taskCol.remove({});

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
            '_id': r.value._id.toString(),
            'task': r.value.task,
            'lastProcessedTs': r.value.lastProcessedTs
        }
    });
}

taskCol.checkResultValidity = function(result) {
    var _id = new ObjectId(result._id);
    return taskCol.findOne({ '_id': _id }, { 'lastProcessedTs': true, 'status': true }).then((r) => {
        return r !== null && r.lastProcessedTs === result.lastProcessedTs && r.status === taskStatus.processing;
    });
}
