
var config = require('../../config');
var utility = require('../../utility');
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
            console.log('wating task...');
            getReadyTask().then((task) => {
                if(task === null) i = (i === len - 1 ? i : i + 1);
                else return execute(task).then(() => i = 0);
            }).catch(err => {
                console.log(err);
            }).then(loop);
        }, waitTime[i]);
    }
    loop();
};

var execute = function(task) {
    console.log('start to execute task..')
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
        console.log('task completed, status: ', res.status);
        return sendResult(res);
    });
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

var sendResult = function(data) {
    var postData = JSON.stringify(data);
    var opt = {
        host: config.dispatcherHost,
        port: config.dispatcherPort,
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
