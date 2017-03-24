
var taskCol = require('./db').taskCol;
var ObjectId = require('mongodb').ObjectId;
var map = {
    'get': get,
    'report': report
}

module.exports = function(args, verb, res) {
    if(!(verb in map)) {
        res.writeHead(400);
        res.end();
        return;
    }
    map[verb](args, res);
}

// find and return ready task to consumer.
function get(args, res) {
    taskCol.findReadyTask().then((r) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(r));
    }, (err) => {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify(null));
        console.log('err when calling task.getReadyTask, err: ', err);
    });
}

// accept result from consumer, check it and update collection.
function report(result, res) {
    console.log('task collection received result report: ', result);
    taskCol.checkResultValidity(result).then((r) => {
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
    }).catch((err) => {
        console.log(err);
        res.writeHead(500);
        res.end();
    });
}
