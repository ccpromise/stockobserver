
var ObjectId = require('mongodb').ObjectId;
var http = require('http');
var url = require('url');
var taskStatus = require('../../constants').taskStatus;
var getSecID = require('../../datasrc/wmcloud/index').getSecID;

var config = require('../../config');
var syncTime = config.stockSyncTime;
var localPort = config.localPort;

var utility = require('../../utility');
var time = utility.time;
var file = utility.file;

var taskdb = require('./db');
var db = taskdb.database;
var syncDateCol = taskdb.syncDateCol;
var taskCol = taskdb.taskCol;

var lastSyncDay = time.yesterday();
var server = null;

var setProducer = function() {
    var loop = function() {
        setTimeout(() => {
            var today = time.today();
            var syncTimeToday = today;
            time.setUTCHours(syncTimeToday, syncTime.hour);
            time.setUTCMinutes(syncTimeToday, syncTime.minute || 0);
            time.setUTCMilliseconds(syncTimeToday, syncTime.milliseconds || 0);
            if(time.isAfter(today, lastSyncDay) && time.isAfter(time.now(), syncTimeToday)) {
                console.log('start to produce task');
                syncDateCol.find({}).then((list) => {
                    var idArr = [];
                    var curStock = {};
                    list.forEach((stock) => {
                        curStock[stock.secID] = true;
                        if(time.isAfter(today, time.createDate(stock.syncDate)))
                            idArr.push(stock.secID);
                    });
                    return getSecID().then((list) => {
                        list.forEach((secID) => {
                            if(!(secID in curStock))
                                idArr.push(secID); // ??
                        });
                    }).then(() => {
                        console.log('insert new task for secID: ', idArr);
                        return idArr.length === 0 ? Promise.resolve() : Promise.all([
                            taskCol.insertTask(idArr),
                            syncDateCol.upsertMany(idArr.map((secID) => {
                                return {
                                    'filter': { 'secID': secID },
                                    'update': { $set: { 'syncDate': time.format(time.today(), 'YYYY-MM-DD') } }
                                }
                            }))
                        ]);
                    });
                }).then(() => {
                    console.log('update last sync date to today');
                    lastSyncDay = today;
                    loop();
                });
            }
            else loop();
        }, 5000);
    };
    return Promise.resolve().then(loop);
};

var clearTimeout = function() {
    var loop = function() {
        setTimeout(() => {
            taskCol.clearTimeout().then((r) => {
                console.log('cleared task number: ', r.result.nModified);
                loop();
            });
        }, 6000);
    }
    return Promise.resolve().then(() => loop());
};

// http
var createServer = function() {
    server = http.createServer((req, res) => {
        var pathname = url.parse(req.url).pathname;
        if(pathname === '/dispatch') {
            taskCol.findReadyTask().then((r) => {
                res.writeHead(200, { 'Content-type': 'application/json'});
                res.write(JSON.stringify(r));
                res.end();
            })
        }
        else if(pathname === '/upload') {
            var body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end', () => {
                console.log('server received the data: ', body);
                var result = JSON.parse(body.toString());
                var result_id = new ObjectId(result.id);
                taskCol.findOne({ '_id': result_id }).then((doc) => {
                    if(doc === null || doc.status !== taskStatus.processing || doc.lastProcessedTs !== result.lastProcessedTs) return 400;
                    return taskCol.update({
                        '_id':  result_id
                    }, {
                        $set: { 'status': result.status },
                        $push: { 'log': result.log }
                    }).then(() => { return 200; });
                }).then((respondCode) => {
                    res.writeHead(respondCode);
                    res.end();
                }, (err) => {
                    res.writeHead(500);
                    res.end();
                });
            })
        }
    });
    server.listen(localPort);
    console.log('start to listen on port', localPort);
};

setProducer();
clearTimeout();
createServer();
