
var ObjectId = require('mongodb').ObjectId;
var utility = require('../../../utility');
var config = require('../../../config');
var taskStatus = require('../../../constants').taskStatus;
var Database = utility.database;
var time = utility.time;
var mongoUrl = config.mongoUrl;
var maxTaskDuration = config.maxTaskDuration;

var db = new Database(mongoUrl);
var syncdateCol = db.getCollection('syncdateCol', { 'secID': true, 'syncdate': true });
var taskCol = db.getCollection('taskCol', { 'secID': true, 'status': true, 'lastProcessingTime': true, 'log': true });

// test
//taskCol.remove({});
//syncdateCol.remove({});

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

taskCol.insertTask = function(idArr) {
    var buildTask = function(id) {
        return {
            'secID': id,
            'status': taskStatus.ready,
            'log': [{
                'desc': 'build new',
                'time': time.format(time.now()),
                'err': null
            }]
        }
    }
    return taskCol.insertMany(idArr.map(buildTask));
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
            'task': {
                'type': 'updateStockData',
                'pack': r.value.secID
            },
            'lastProcessedTs': r.value.lastProcessedTs
        }
    });
}

// result: {
// id:
// status:
// lastProcessdTs:
// log:
// }
taskCol.checkResultValidity = function(result) {
    var id = new ObjectId(result.id);
    return taskCol.findOne({ 'id': id }, { 'lastProcessedTs': true, 'status': true }).then((r) => {
        return r !== null && r.lastProcessedTs === result.lastProcessedTs && r.status === taskStatus.processing;
    });
}

exports.syncdateCol = syncdateCol;
exports.taskCol= taskCol;
