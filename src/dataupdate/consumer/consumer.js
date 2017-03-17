
var config = require('../../config');
var utility = require('../../utility');
var file = utility.file;
var validate = utility.validate;
var time = utility.time;
var http = utility.http;
var taskStatus = require('../../constants').taskStatus;
var updateStockData = require('./updateStockData');
var waitTime = config.waitTime;

var run = function() {
    var len = waitTime.length;
    var i = 0;
    var loop = function() {
        setTimeout(() => {
            getReadyTask().then((task) => {
                if(task === null) i = (i === len - 1 ? i : i + 1);
                else return execute(task).then(() => i = 0);
            }).then(() => loop());
        }, waitTime[i]);
    }
    return Promise.resolve().then(loop);
};

var execute = function(task) {
    var id = task.id;
    var lastProcessedTs = task.lastProcessedTs;
    return updateStockData(task.secID).then(() => {
        return {
            id: id,
            status: taskStatus.success,
            lastProcessedTs: lastProcessedTs,
            log: {
                'desc': 'succeed to update stock data',
                'time': time.format(time.now()),
                'err': null
            }
        };
    }, (err) => {
        return {
            id: id,
            status: taskStatus.fail,
            lastProcessedTs: lastProcessedTs,
            log: {
                'desc': 'failed to update stock data',
                'time': time.format(time.now()),
                'err': err.message
            }
        }
    }).then((res) => {
        console.log('task result: ', res);
        return sendResult(res);
    }).catch((err) => console.log(err));
}

// http
var getReadyTask = function() {
    var opt = {
        host: config.localHost,
        port: config.localPort,
        path: '/dispatch'
    };
    return http.request(opt).then((data) => {
        return JSON.parse(data.toString());
    });
}

var sendResult = function(data) {
    var postData = JSON.stringify(data);
    var opt = {
        host: config.localHost,
        port: config.localPort,
        path: '/upload',
        method: 'POST',
        data: postData,
        headers: {
            'content-type': 'application/json'
        }
    }
    return http.request(opt);
}

run();
