
var time = require('../../utility').time;
var taskStatus = require('../../constants').taskStatus;
var waitTime = require('../../config').waitTime;
var taskLib = require('./taskLib');
var httpReq = require('../httpReqTmpl');

var run = function() {
    var len = waitTime.length;
    var i = 0;
    var loop = function() {
        setTimeout(() => {
            httpReq('/task', null, 'get').then((doc) => {
                doc = JSON.parse(doc.toString());
                if(doc === null) i = (i === (len - 1) ? i : (i + 1));
                else return execute(doc).then(() => i = 0);
            }).catch(err => console.log(err)).then(loop);
        }, waitTime[i]);
    }
    loop();
};

var execute = function(doc) {
    var taskType = doc.task.type;
    var args = doc.task.pack;
    var invalidArg = {
        _id: doc._id,
        status: taskStatus.fail,
        lastProcessedTs: doc.lastProcessedTs,
        log: {
            'desc': 'task fail',
            'time': time.format(time.now()),
        }
    };
    if(taskType in taskLib) {
        var handler = taskLib[taskType];
        if(handler.checkArgs(args)) {
            return handler.run(args).then(() => {
                return {
                    _id: doc._id,
                    status: taskStatus.success,
                    lastProcessedTs: doc.lastProcessedTs,
                    log: {
                        'desc': 'task succeed',
                        'time': time.format(time.now()),
                        'err': null
                    }
                }
            }, (err) => {
                console.log('task fail');
                return {
                    _id: doc._id,
                    status: taskStatus.fail,
                    lastProcessedTs: doc.lastProcessedTs,
                    log: {
                        'desc': 'task fail',
                        'time': time.format(time.now()),
                        'err': err.message
                    }
                }
            }).then((r) => {
                return httpReq('/task', r, 'report');
            });
        }
        invalidArg.log.err = 'invalid arguments: ' + args;
        return httpReq('/task', invalidArg, 'report');
    }
    invalidArg.log.err = 'invalid task type: ' + taskType;
    return httpReq('/task', invalidArg, 'report');
}

run();
