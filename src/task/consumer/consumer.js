
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
            getReadyTask().then((task) => {
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
                return sendResult(r, '/upload');
            });
        }
        return sendResult('invalid task pack: ' + args, '/fail');
    }
    return sendResult('invalid task type: ' + taskType, '/fail');
}

// http
var getReadyTask = function() {
    var opt = {
        host: config.dispatcherHost,
        port: config.dispatcherPort,
        path: '/dispatch'
    };
    return http.request(opt).then((data) => {
        return JSON.parse(data.toString());
    });
}

var sendResult = function(data, path) {
    console.log('send back result: ', data);
    var postData = JSON.stringify(data);
    var opt = {
        host: config.dispatcherHost,
        port: config.dispatcherPort,
        path: path,
        method: 'POST',
        data: postData,
        headers: {
            'content-type': 'application/json'
        }
    }
    return http.request(opt);
}

run();
