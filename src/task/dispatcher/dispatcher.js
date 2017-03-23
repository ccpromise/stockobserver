
var http = require('http');
var url = require('url');
var config = require('../../config');
var produceInterval = config.produceInterval;
var timeoutInterval = config.timeoutInterval;
var syncTime = config.stockSyncTime;
var port = config.dispatcherPort;
var host = config.dispatcherHost;
var time = require('../../utility').time;
var lastSyncDate = time.yesterday();
var taskStatus = require('../../constants').taskStatus;
var getSecID = require('../../datasrc/wmcloud').getSecID;

var syncdateCol = require('./updateStockData/db').syncdateCol;
var taskCol = require('./taskManager/db').taskCol;

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
                            taskCol.insertMany(idArr.map((id) => {
                                return {
                                    'task': {
                                        'type': 'updateStockData',
                                        'pack': id
                                    },
                                    'status': taskStatus.ready,
                                    'log': [{
                                        'desc': 'build new',
                                        'time': time.format(time.now()),
                                        'err': null
                                    }]
                                }
                            }))
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
        var body = [];
        var pathname = '.' + url.parse(req.url).pathname;
        var verb = req.headers.verb;
        req.on('data', (chunk) => body.push(chunk));
        req.on('end', () => {
            try {
                var args = JSON.parse(Buffer.concat(body).toString());
                var handler = require(pathname + '/http');
            }
            catch (err){
                console.log(err);
                res.writeHead(400);
                res.end();
                return;
            }
            handler(args, verb, res);
        })
    });
    server.listen(port, host);
    console.log('start to listen on port: ', port);
}

run();
