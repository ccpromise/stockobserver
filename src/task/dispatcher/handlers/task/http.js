
/**
 * task/http:
 * 1 insert newly created tasks from produer.
 * 2 find ready task and return to consumer
 * 3 receive task result, check and insert.
 * 4 update and find producedateCol.
 */
const db = require('./db');
const taskCol = db.taskCol;
const producedateCol = db.producedateCol;
const ObjectId = require('mongodb').ObjectId;
const dbOperation = require('../dbOperation');
const time = require('../../../../utility').time;
const taskStatus = require('../../../../constants').taskStatus;

exports.task = function(arg, verb, res) {
    if(verb === 'dispatch') {
        return dispatch(res);
    }
    else if(verb === 'report') {
        return report(arg, res);
    }
    else {
        return dbOperation(taskCol, arg, verb, res);
    }
}

exports.producedate = function(arg, verb, res) {
    return dbOperation(producedateCol, arg, verb, res);
}

/**
 * find and return ready task to consumer.
 */
function dispatch(res) {
    return findReadyTask().then((r) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(r));
    });
}

/**
 * accept result from consumer, check it and update collection.
 */
function report(result, res) {
    return checkResultValidity(result).then((r) => {
        var _id = new ObjectId(result._id);
        if(r) {
            return taskCol.update({
                _id: _id
            }, {
                $set: { status: result.status },
                $push: { log: result.log }
            }).then(() => {
                console.log('receive result and update collection.');
                res.writeHead(200);
                res.end();
            });
        }
        else {
            res.writeHead(400);
            res.end();
        }
    });
}

function findReadyTask() {
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

function checkResultValidity(result) {
    var _id = new ObjectId(result._id);
    return taskCol.findOne({ '_id': _id }, { 'lastProcessedTs': true, 'status': true }).then((r) => {
        return r !== null && r.lastProcessedTs === result.lastProcessedTs && r.status === taskStatus.processing;
    });
}
