
/**
 * dispatcher: manage all tasks status.
 * 1) receive newly produced tasks from producer
 * 2) dispatch ready tasks to consumer.
 * 3) receive execution results from consumer.
 * usage sample: node dispatcher.js
 */
const http = require('http');
const url = require('url');
const config = require('../../config');
const utility = require('../../utility');
const time = utility.time;
const async = utility.async;
const taskStatus = require('../../constants').taskStatus;
const checkReadyCondition = require('./checkReadyCondition');

/**
 * task collection
 */
const taskCol = require('./taskManager/db').taskCol;

/**
 * all http handlers.
 */
const simulateHttp = require('./simulate/http');
const taskManagerHttp = require('./taskManager/http');
const tradeHttp = require('./trade/http');
const pathMap = {
    '/simulate': simulateHttp.simulate,
    '/simdate': simulateHttp.simdate,
    '/task': taskManagerHttp.task,
    '/producedate': taskManagerHttp.producedate,
    '/trade': tradeHttp.tradeplan
}

/**
 * create server which receives http request from producer&consumer&task handlers
 */
function createServer() {
    var server = http.createServer((req, res) => {
        //* preflight request
         if(req.headers['access-control-request-method']) {
             res.writeHead(200, {
                 'Access-Control-Allow-Origin': req.headers.origin,
                 'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
                 'Access-Control-Allow-Method': req.headers['access-control-request-method']
             });
             res.end();
             return;
         }
         var path = url.parse(req.url).pathname;
         //* invalid path
         if(!(path in pathMap)) {
             res.writeHead(400);
             res.end();
             return;
         }
         var verb = req.headers.verb;
         var body = [];
         req.on('data', (chunk) => body.push(chunk));
         req.on('end', () => {
             var content = Buffer.concat(body).toString();
             try {
                 var data = JSON.parse(content);
             }
             catch (err) {
                 res.writeHead(400);
                 res.end();
                 return;
             }
             //* call corresponding http handler
             pathMap[path](data, verb, res, req);
         });
    });
    server.listen(config.dispatcherPort, config.dispatcherHost);
    console.log('start to listen on ', config.dispatcherHost, ': ', config.dispatcherPort);
}

/**
 * remove timeout task from taskCol
 */
function removeTimeOutTask() {
    var loop = function() {
        setTimeout(() => {
            taskCol.update({
                'status': taskStatus.processing, 'lastProcessedTs': { $lt: time.getTs(time.now()) - config.maxTaskDuration }
            }, {
                $set: { 'status': taskStatus.ready },
                $push: { 'log': {
                    'desc': 'task time out',
                    'time': time.format(time.now()),
                    'err': new Error('task time out')
                }}
            }).then((r) => {
                console.log('remove timeout task, #: ', r.result.nModified);
            }, (err) => {
                console.log('fail to remove task: ', err);
                process.exit();
            }).then(loop);
        }, config.checkTimeoutInterval);
    };
    loop();
}

/**
 * check waiting task if the ready condition has been satisfied.
 */
function checkWaitingTask() {
    var loop = function() {
        setTimeout(() => {
            taskCol.find({ status: taskStatus.wait }).then((docs) => {
                var i = 0;
                var N = docs.length;
                var readyTaskId = [];

                //* find waiting task whoes ready condtion is true
                return async.parallel(() => {
                    return i < N;
                }, () => {
                    var j = i++;
                    var type = docs[j].readyCondition.type;
                    var pack = docs[j].readyCondition.pack;
                    return checkReadyCondition(type, pack).then((r) => {
                        if(r) readyTaskId.push(docs[j]._id);
                    });
                }, config.parallelN).then(() => { return readyTaskId; });
            }).then((readyTaskId) => {
                //* update status from wait to ready
                console.log('find waiting task ready: ', readyTaskId);
                return readyTaskId.length === 0
                ? Promise.resolve()
                : taskCol.updateMany(readyTaskId.map((id) => {
                    return {
                        'filter': { _id: id },
                        'update': {
                            $set: { status: taskStatus.ready },
                            $push: { log: {
                                'desc': 'update waiting task to ready',
                                'time': time.format(time.now()),
                                'err': null
                            }}
                        }
                    }
                }));
            }).then((r) => {
                console.log('check waiting task finished');
            }, (err) => {
                console.log('find error: ', err);
                process.exit();
            }).then(loop);
        }, config.checkWaitingTaskInterval)
    };
    loop();
}

function run() {
    createServer();
    removeTimeOutTask();
    checkWaitingTask();
};

run();
