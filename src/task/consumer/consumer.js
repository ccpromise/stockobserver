
var config = require('../../config');
var utility = require('../../utility');
var validate = utility.validate;
var time = utility.time;
var http = utility.http;
var file = utility.file;
var taskStatus = require('../../constants').taskStatus;
var waitTime = config.waitTime;
var taskLib = require('./taskLib');

var run = function() {
    var len = waitTime.length;
    var i = 0;
    var loop = function() {
        setTimeout(() => {
            console.log('wating task...');
            postToTaskManager(null, 'get').then((task) => {
                task = JSON.parse(task.toString());
                if(task === null) i = (i === len - 1 ? i : i + 1);
                else return execute(task).then(() => i = 0);
            }).catch(err => console.log(err)).then(loop);
        }, waitTime[i]);
    }
    loop();
};

var execute = function(task) {
    console.log('start to execute task..')
    var taskType = task.task.type;
    var args = task.task.pack;
    var invalidArg = {
        id: task.id,
        status: taskStatus.success,
        lastProcessedTs: task.lastProcessedTs,
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
                    id: task.id,
                    status: taskStatus.success,
                    lastProcessedTs: task.lastProcessedTs,
                    log: {
                        'desc': 'task succeed',
                        'time': time.format(time.now()),
                        'err': null
                    }
                }
            }, (err) => {
                return {
                    id: task.id,
                    status: taskStatus.fail,
                    lastProcessedTs: task.lastProcessedTs,
                    log: {
                        'desc': 'task fail',
                        'time': time.format(time.now()),
                        'err': err.message
                    }
                }
            }).then((r) => {
                return postToTaskManager(r, 'report');
            });
        }
        invalidArg.log.err = 'invalid arguments: ' + args;
        return postToTaskManager(invalidArg, 'report');
    }
    invalidArg.log.err = 'invalid task type: ' + taskType;
    return postToTaskManager(invalidArg, 'report');
}

var postToTaskManager = function(args, verb) {
    var opt = {
        host: config.dispatcherHost,
        port: config.dispatcherPort,
        path: 'taskManager',
        method: 'POST',
        data: JSON.stringify(args),
        headers: {
            'content-type': 'application/json',
            verb: verb
        }
    }
    return http.request(opt);
}

// http
/*
var getReadyTask = function() {
    var opt = {
        host: config.dispatcherHost,
        port: config.dispatcherPort,
        path: 'taskManger',
        method: 'POST',
        data: JSON.stringify(null),
        headers: {
            'content-type': 'application/json',
            'verb': 'getReadyTask'
        }
    };
    return http.request(opt).then((data) => {
        return JSON.parse(data.toString());
    });
}

var postToTaskManger = function(data) {
    console.log('send back result: ', data);
    var postData = JSON.stringify(data);
    var opt = {
        host: config.dispatcherHost,
        port: config.dispatcherPort,
        path: 'taskManager/report',
        method: 'POST',
        data: postData,
        headers: {
            'content-type': 'application/json'
        }
    }
    return http.request(opt);
}
*/
run();
