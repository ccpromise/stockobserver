
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
const azure = utility.azureStorage;
const taskStatus = require('../../constants').taskStatus;
const checkReadyCondition = require('./condition/checkReadyCondition');
const getSecID = require('../../datasrc/wmcloud').getSecID;

const httpHandlers = require('./handlers');
/**
 * task collection
 */
const taskCol = httpHandlers.task.db.taskCol;
const lastSyncDateCol = httpHandlers.task.db.lastSyncDateCol;

/**
 * all http handlers.
 */
const simulateHttp = httpHandlers.simulate.http;
const taskHttp = httpHandlers.task.http;
const tradeHttp = httpHandlers.trade.http;
const pathMap = {
    '/simulate': simulateHttp.simulate,
    '/simdate': simulateHttp.simdate,
    '/task': taskHttp.task,
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
             var headers = { 'Content-type': 'application/json' };
             if(req.headers.origin !== undefined) {
                 headers['Access-Control-Allow-Origin'] = req.headers.origin;
             }
             var content = Buffer.concat(body).toString();
             try {
                 var data = JSON.parse(content);
             }
             catch (err) {
                 res.writeHead(400, headers);
                 res.end();
                 return;
             }
             //* check validity and call corresponding http handler
             var handler = pathMap[path];
             if(!handler.isValid(data, verb)) {
                 res.writeHead(400, headers);
                 res.end();
                 return;
             }

             handler.run(data, verb).then((r) => {
                 res.writeHead(200, headers);
                 res.end(JSON.stringify(r));
             }).catch((err) => {
                 var code = err === 400 ? 400 : 500;
                 res.writeHead(code, headers);
                 res.end();
             })
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
            }).catch((err) => {
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
            }).catch((err) => {
                console.log('fail to check waiting task: ', err);
                process.exit();
            }).then(loop);
        }, config.checkWaitingTaskInterval)
    };
    loop();
}

var lastProducedate = time.yesterday();

function producer() {
    var loop = function() {
        setTimeout(() => {
            var today = time.today();
            var produceTime = time.today(config.produceTime);
            if(time.isAfter(time.now(), produceTime) && time.isAfter(today, lastProducedate)) {
                console.log(time.format(today, 'YYYYMMDD'), ': start to produce task...');
                //* find secID list to produce task
                return getTaskList().then((list) => {
                    console.log('# of stocks to update: ', list.length);
                    if(list.length === 0) return Promise.resolve();
                    //* produce stock data update task
                    return insertUpdateTask(list).then((objIdMap) => {
                        //* objIdMap maps each secID to the object id.
                        //* produce simulate task. bind ready condition with the corresponding object id
                        return insertSimulateTask(list, objIdMap);
                    }).then(() => {
                        //* update produce date
                        return updateLastSyncDate(list);
                    });
                }).then(() =>{
                    console.log('produce task finished');
                    lastProducedate = today;
                }, (err) => {
                    console.log('fail to produce task: ', err);
                    process.exit();
                }).then(loop);
            }
            else loop();
        }, config.produceInterval)
    };
    loop();
}

function getTaskList() {
    return Promise.all([getSecID(), getLastSyncDate()]).then((r) => {
        var allList = r[0];
        var curList = r[1].reduce((pre, cur) => {
            pre[cur.secID] = cur.lastSyncDate;
            return pre;
        }, {});
        /**
         * new task will be created:
         * 1\ secID not exist in current lastSyncDateCol.
         * 2\ or, last syncdate is before today.
         */
        var today = time.today();
        var updateList = allList.filter((secID) => {
            return !(secID in curList) || time.isAfter(today, curList[secID]);
        });
        //* notice: as all stock secID stored in Azure are lower case. make sure getSecID() return lowercase secID array.
        return updateList;
    });
}

function getLastSyncDate() {
    return lastSyncDateCol.find({});
}

/**
 * produce stock update task. return secID-objectId map.
 */
function insertUpdateTask(list) {
    var docs = list.map((secID) => {
        return {
            task: {
                type: 'updateStockData',
                pack: secID
            },
            status: taskStatus.ready,
            log: [{
                desc: 'build new ready task',
                time: time.format(time.now()),
                err: null
            }]
        };
    });
    return taskCol.insertMany(docs).then((r) => {
        var objIdMap = r.ops.reduce((pre, cur) => {
            pre[cur.task.pack] = cur._id.toString();
            return pre;
        }, {});
        return objIdMap;
    });
}

/**
 * produce simulate task. associate task ready condtion with the corresponding object id
 */
function insertSimulateTask(list, objIdMap) {
    var docs = list.map((secID) => {
        return {
            task: { type: 'simulate', pack: {tradeplanId: 'MA1060', secID: secID } }, // TODO merge more trade plans
            status: taskStatus.wait,
            readyCondition: {
                type: 'success',
                pack: objIdMap[secID]
            },
            log: [{
                desc: 'build new waiting task',
                time: time.format(time.now()),
                err: null
            }]
        };
    });
    return taskCol.insertMany(docs);
}

/**
 * update the produce date to today.
 */
function updateLastSyncDate(list) {
    var today = time.format(time.today(), 'YYYYMMDD');
    var docs = list.map((secID) => {
        return {
            'filter': { secID: secID },
            'update': { $set: { lastSyncDate: today } }
        };
    });
    return lastSyncDateCol.upsertMany(docs);
}

function run() {
    createServer();
    removeTimeOutTask();
    checkWaitingTask();
    producer();
};

run();
