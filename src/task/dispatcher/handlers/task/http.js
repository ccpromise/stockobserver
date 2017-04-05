
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
const utility = require('../../../../utility');
const time = utility.time;
const validate = utility.validate;
const taskStatus = require('../../../../constants').taskStatus;

/**
 * http request sent to taskCol
 * .isValid() check the validity of arg and verb
 * .run() perform the actual request
 */
exports.task = {
    isValid: function(arg, verb) {
        if(verb === 'dispatch') return arg === null;
        if(verb === 'report') {
            return ObjectId.isValid(arg._id) && validate.isPosInt(arg.lastProcessedTs)
            && (arg.status === taskStatus.fail || arg.status === taskStatus.success)
            && (validate.isObj(arg.log) && validate.hasOwnProperty(arg.log, ['desc', 'time', 'err']));
        }
        return verb === 'insertMany' && dbOperation.isValid(verb, arg);
    },
    run: function(arg, verb, res) {
        if(!exports.task.isValid(arg, verb)) {
            res.writeHead(400);
            res.end();
            return Promise.resolve();
        }
        if(verb === 'dispatch') {
            return dispatch(res);
        }
        else if(verb === 'report') {
            return report(arg, res);
        }
        else {
            return dbOperation.run(taskCol, arg, verb, res);
        }
    }
}

/**
 * http request sent to producedateCol
 * .isValid() check the validity of arg and verb
 * .run() perform the actual request
 */
exports.producedate = {
    isValid: function(arg, verb) {
        return (verb === 'find' || verb === 'upsertMany')
        && dbOperation.isValid(verb, arg);
    },
    run: function(arg, verb, res) {
        if(!exports.producedate.isValid(arg, verb)) {
            res.writeHead(400);
            res.end();
            return Promise.resolve();
        }
        return dbOperation.run(producedateCol, arg, verb, res);
    }
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
