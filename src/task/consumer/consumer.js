
/**
 * consumer:
 * 1) get ready tasks from dispatcher
 * 2) invoke handlers to perform task
 * 3) report task results to dispatcher
 * usage sample:
 * node consumer.js
 */
const time = require('../../utility').time;
const taskStatus = require('../../constants').taskStatus;
const intervals = require('../../config').consumerQueryIntervals;
const taskLib = require('./taskLib');
const httpReq = require('../httpReqTmpl');

/**
 * get task from dispatcher.
 * if task is null, query time interval would be larger. else, execute the task the report result
 */
function run() {
    var i = 0;
    var N = intervals.length;
    var iter = function() {
        setTimeout(() => {
            httpReq('/task', null, 'dispatch').then((r) => {
                var task = JSON.parse(r.toString());
                if(task === null) i = Math.min(i + 1, N - 1);
                else return execute(task).then(report).then(() => { i = 0; });
            }).catch((err) => {
                console.log('find error in consumer: ', err);
                process.exit();
            }).then(iter);
        }, intervals[i]);
    };
    iter();
}

/**
 * invoke handler to execute tasks.
 */
function execute(doc) {
    var taskType = doc.task.type;
    var taskPack = doc.task.pack;
    var handler = taskLib[taskType];

    if(handler === undefined || !handler.checkPack(taskPack)) {
        return {
            _id : doc._id,
            lastProcessedTs: doc.lastProcessedTs,
            status: taskStatus.fail,
            log: {
                'desc': 'invalid task type or pack',
                'time': time.format(time.now()),
                'err': 'invalid task type or pack'
            }
        }
    }
    return handler.run(taskPack).then(() => {
        console.log('task success');
        return {
            _id: doc._id,
            lastProcessedTs: doc.lastProcessedTs,
            status: taskStatus.success,
            log: {
                'desc': 'task success',
                'time': time.format(time.now()),
                'err': null
            }
        }
    }, (err) => {
        console.log('task fail');
        console.log(err);
        return {
            _id: doc._id,
            lastProcessedTs: doc.lastProcessedTs,
            status: taskStatus.fail,
            log: {
                'desc': 'task fail',
                'time': time.format(time.now()),
                'err': err
            }
        }
    })
}

/**
 * report task result to dispatcher
 */
function report(result) {
    return httpReq('/task', result, 'report');
}

run();
