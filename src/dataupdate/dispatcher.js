
var http = require('http');
var stockTask = require('./stockTask');
var url = require('url');

var config = require('../config');
var syncTime = config.stockSyncTime;
var localPort = config.localPort;
var taskStatus = config.constants.taskStatus;

var utility = require('../utility');
var time = utility.time;
var file = utility.file;

var taskdb = require('./db');
var db = taskdb.database;
var syncDateCol = taskdb.syncDate;
var taskCol = taskdb.task;

var isConnected = true;
var lastSyncDate = time.yesterday();
var server = null;

exports.setProducer = function() {
    var loop = function() {
        setTimeout(() => {
            if(!isConnected) return;
            var syncTimeToday = time.today('YYYY-MM-DD') + ' ' + syncTime;
            if(lastSyncDate !== time.today() && time.isAfter(time.now(), syncTimeToday)) {
                console.log('start to produce task');
                syncDateCol.find({}).then((list) => {
                    var idArr = [];
                    list.forEach((stock) => {
                        if(time.isAfter(time.today(), stock.syncDate))
                            idArr.push(stock.secID);
                    });
                    console.log('insert new task for secID: ', idArr);
                    Promise.all([taskCol.insertTask(idArr), syncDateCol.updateSyncDate(idArr)]).then(() => {
                        console.log('update last sync date to today');
                        lastSyncDate = time.today();
                        loop();
                    });
                });
            }
            else loop();
        }, 5000);
    };
    return Promise.resolve().then(() => loop());
}

exports.clearTimeout = function() {
    var innerLoop = function() {
        if(!isConnected) return;
        taskCol.clearTimeout().then((r) => {
            console.log('cleared task number: ', r.result.nModified);
            if(r.result.nModified === 1) {
                innerLoop();
            }
            else loop();
        });
    };
    var loop = function() {
        setTimeout(() => {
            console.log('start to clear time out task.')
            innerLoop();
        }, 5000);
    }
    return Promise.resolve().then(() => loop());
}

exports.createServer = function() {
    server = http.createServer((req, res) => {
        var pathname = url.parse(req.url).pathname;
        if(pathname === '/getReadyTask.json') {
            taskCol.findReadyTask().then((r) => {
                res.writeHead(200, { 'Content-type': 'application/json'});
                res.write(JSON.stringify(r));
                res.end();
            })
        }
        else if(pathname === '/updateStockData.js') {
            res.writeHead(200, { 'Content-type': 'text/plain'});
            res.write(__dirname + '/updateStockData.js');
            res.end();
        }
        else if(pathname === '/upload') {
            var body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end', function () {
                var result = JSON.parse(body);
                taskCol.updateTask(result);
            });
            res.writeHead(200);
            res.end();
        }
    });
    server.listen(localPort);
    console.log('start to listen on port', localPort);
}

exports.endConnection = function() {
    isConnected = false;
    return Promise.resolve().then(() => {
        return db.close().then(() => {
            server.close();
        });
    })
}
