
var taskCol = require('./db').taskCol;
var ObjectId = require('mongodb').ObjectId;
var map = {
    'get': get,
    'report': report
}

module.exports = function(arg, verb, res) {
    if(!(verb in map)) {
        res.writeHead(400);
        res.end();
        return;
    }
    map[verb](arg, res);
}


function get(arg, res) {
    taskCol.findReadyTask().then((r) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(r));
    }, (err) => {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify(null));
        console.log('err when calling task.getReadyTask, err: ', err);
    });
}

function report(result, res) {
    console.log('task collection received result report: ', result);
    taskCol.checkResultValidity(result).then((r) => {
        var id = new ObjectId(result.id);
        if(r) {
            return taskCol.update({
                _id: id
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
