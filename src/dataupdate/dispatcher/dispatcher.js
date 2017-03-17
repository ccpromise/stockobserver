
var http = require('http');
var url = require('url');
var taskStatus = require('../../constants').taskStatus;

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
            time.setHours(syncTimeToday, syncTime.hour);
            time.setMinutes(syncTimeToday, syncTime.minute || 0);
            time.setMilliseconds(syncTimeToday, syncTime.milliseconds || 0);
            if(time.isAfter(today, lastSyncDay) && time.isAfter(time.now(), syncTimeToday)) {
                console.log('start to produce task');
                syncDateCol.find({}).then((list) => {
                    var idArr = [];
                    list.forEach((stock) => {
                        if(time.isAfter(today, time.createTime(stock.syncDate)))
                            idArr.push(stock.secID);
                    });
                    console.log('insert new task for secID: ', idArr);
                    return idArr.length === 0 ? Promise.resolve() : Promise.all([
                        taskCol.insertTask(idArr),
                        syncDateCol.update({ 'secID': { $in: idArr } }, { $set: { 'syncDate': time.format(time.today(), 'YYYY-MM-DD') } })
                    ]);
                }).then(() => {
                    console.log('update last sync date to today');
                    lastSyncDay = today;
                    loop();
                });
            }
            else loop();
        }, 5000);
    };
    return Promise.resolve().then(() => loop());
}();

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
}();

// http
var createServer = function() {
    server = http.createServer((req, res) => {
        var pathname = url.parse(req.url).pathname;
        if(pathname === '/getReadyTask.json') {
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
            console.log('body: ', body); //*
            req.on('end', () => {
                var result = JSON.parse(body.toString());
                taskCol.find({ 'id': result.id }, { 'status': true, 'lastProcessedTs': true }).then((fields) => {
                    if(fields.length !== 1 || fields[0].status !== taskStatus.processing || fields[0].lastProcessedTs !== result.lastProcessedTs) res.writeHead(400);
                    else {
                        taskCol.update({
                            '_id': result.id
                        }, {
                            $set: { 'status': result.status },
                            $push: { 'log': result.log }
                        });
                        res.writeHead(200);
                    }
                }).then(() => res.end());
            })
        }
    });
    server.listen(localPort);
    console.log('start to listen on port', localPort);
}();
