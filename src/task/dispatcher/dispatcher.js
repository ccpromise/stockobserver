
// model:
// each task has its own producer and consumer.
// dispatcher is to generally control how to setProducer, clear time out, create server by calling the methods of producer.
// so finally we should use
// node dispatcher task1 // manage the task that task1.produce produces.
// node dispatcher task2 // manage the task that task2.produce produces.
// node consumer task1 // dispatcher and consumer of task1 communicate in port x.
// node consumer task2 // ........................of task2 communicate in another port.

var http = require('http');
var url = require('url');
var config = require('../../config');
var produceInterval = config.produceInterval;
var timeoutInterval = config.timeoutInterval;
var maxProcessTs = config.maxProcessTs;
var syncTime = config.stockSyncTime;
var port = config.dispatcherPort;
var host = config.dispatcherHost;
var time = require('../../utility').time;
var lastSyncDate = time.yesterday();
var getSecID = require('../../datasrc/wmcloud').getSecID;

var db = require('./db');
var syncdateCol = db.syncdateCol;
var taskCol = db.taskCol;
var ObjectId = require('mongodb').ObjectId;

var run = function() {
    setProducer();
    clearTimeout();
    createServer();
}

var setProducer = function(task) {
    var loop = function() {
        setTimeout(() => {
            var today = time.today();
            var produceTime = time.today(syncTime);
            if(time.isAfter(time.now(), produceTime) && time.isAfter(today, lastSyncDate)) {
                console.log('start to produce task...');
                syncdateCol.find({}).then((list) => {
                    var curStock = {};
                    var stockArr = list.filter((stock) => {
                        curStock[stock.secID] = true;
                        return time.isAfter(today, stock.syncdate);
                    });
                    var idArr = stockArr.map((stock) => stock.secID);
                    return getSecID().then((list) => {
                        idArr = idArr.concat(list.filter((secID) => !(secID in curStock)));
                        return idArr;
                    });
                }).then((idArr) => {
                    if(idArr.length !== 0) {
                        console.log('secID to update data: ', idArr);
                        return Promise.all([
                            syncdateCol.upsertMany(idArr.map((secID) => {
                                return {
                                    'filter': { secID: secID },
                                    'update': { $set: { syncdate: time.format(today, 'YYYYMMDD') } }
                                }
                            })), //TODO question: updateMany vs update loop
                            taskCol.insertTask(idArr)
                        ]);
                    }
                }).then(() => {
                    console.log('produce task done!');
                    lastSyncDate = time.today();
                }, (err) => {
                    console.log(err);
                }).then(loop);
            }
            else {
                console.log('no task produced now');
                loop();
            }
        }, produceInterval);
    }
    loop();
}

var clearTimeout = function() {
    var loop = function() {
        setTimeout(() => {
            taskCol.clearTimeout().then((r) => {
                console.log('cleared task number: ', r.result.nModified);
            }, (err) => {
                console.log('fail to clear timeout task: ', err);
            }).then(loop);
        }, timeoutInterval)
    }
    loop();
}

var createServer = function() {
    var server = http.createServer((req, res) => {
        var pathname = url.parse(req.url).pathname;
        if(pathname === '/dispatch') {
            taskCol.findReadyTask().then((r) => {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.write(JSON.stringify(r));
                res.end();
            }, (err) => {
                res.writeHead(500, { 'content-type': 'text/plain' });
                res.end();
                console.log('err when calling task.getReadyTask, err: ', err);
            });
        }
        else if(pathname === '/report') {
            var data = [];
            req.on('data', (chunk) => {
                data.push(chunk);
            });
            req.on('end', () => {
                var result = null;
                try {
                    result = JSON.parse(Buffer.concat(data).toString());
                }
                catch (err) {
                    res.writeHead(400);
                    res.end();
                    return;
                }
                console.log('receive result from consumer: ', JSON.stringify(result));
                taskCol.checkResultValidity(result).then((r) => {
                    if(r) {
                        var id = new ObjectId(result.id);
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
                        res.end('result is invalid for the task.');
                    }
                }).catch((err) => {
                    res.writeHead(500); // error when server check result validity or update task
                    res.end('server error');
                });
            });
        }
        else {
            console.log('invalid request path');
            res.writeHead(400);
            res.end('invalid path');
        }
    });
    server.listen(port);
    console.log('start to listen on port: ', port);
}

run();
