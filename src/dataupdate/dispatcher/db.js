
var utility = require('../../utility');
var config = require('../../config');
var taskStatus = require('../../constants').taskStatus;
var getStockList = require('./getStockList');
var Database = utility.database;
var time = utility.time;
var mongoUrl = config.mongoUrl;
var maxTaskDuration = config.maxTaskDuration;

var db = new Database(mongoUrl);
var syncDateCol = db.getCollection('syncDateCol', { 'secID': true, 'syncDate': true });
var taskCol = db.getCollection('taskCol', { 'secID': true, 'status': true, 'lastProcessingTime': true, 'log': true });

// test
//syncDateCol.find({}).then((r) => console.log(r));
//taskCol.find({}).then((r) => console.log(r));

// test
syncDateCol.remove({}).then(() => {
    syncDateCol.initial();
})

syncDateCol.initial = function() {
    return getStockList().then((list) => {
        function buildSyncDate(secID) {
            return {
                'secID': secID,
                'syncDate': '1990-01-01'
            };
        };
        return syncDateCol.insertMany(list.map(buildSyncDate));
    });
};


syncDateCol.updateSyncDate = function(idArr, date) {
    return syncDateCol.update({ 'secID': { $in: idArr } }, { $set: { 'syncDate': date } });
}

taskCol.clearTimeout = function() {
    return taskCol.update({
        'status': taskStatus.processing, 'lastProcessedTs': { $lt: time.getTs(time.now()) - maxTaskDuration }
    }, {
        $set: { 'status': taskStatus.ready },
        $push: { 'log': {
            'desc': 'task time out',
            'time': time.format(time.now()),
            'err': 'task time out'
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
            'id': r.value._id,
            'secID': r.value.secID,
            'lastProcessedTs': r.value.lastProcessedTs
        }
    });
}

exports.syncDateCol = syncDateCol;
exports.taskCol= taskCol;
exports.database = db;
