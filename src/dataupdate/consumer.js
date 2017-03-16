
var utility = require('../utility');
var file = utility.file;
var validate = utility.validate;
var time = utility.time;
var taskStatus = require('../config').constants.taskStatus;
var http = require('./http');

exports.getTask = function() {
    var loop = function() {
        setTimeout(() => {
            http.getReadyTask().then((task) => {
                if(validate.isEmptyArr(task)) loop();
                else execute(task).then(() => loop());
            });
        }, 5000);
    }
    return Promise.resolve().then(() => { return loop(); });
}

function execute(task) {
    console.log('find task: ', task[1]);
    var path = task[0];
    var args = JSON.parse(task[1]);
    var secID = args.secID;
    var id = args.id;
    return require(path)(secID).then(() => {
        return {
            id: id,
            status: taskStatus.success,
            log: {
                'desc': 'succeed to update stock data',
                'time': time.now(),
                'err': null
            }
        };
    }, (err) => {
        return {
            id: id,
            status: taskStatus.fail,
            log: {
                'desc': 'failed to update stock data',
                'time': time.now(),
                'err': err
            }
        }
    }).then((res) => {
        console.log('task result: ', res);
        return http.sendResult(res);
    });
}
