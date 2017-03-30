
const config = require('../../config');
const utility = require('../../utility');
const time = utility.time;
const azure = utility.azureStorage;
var lastProducedate = time.yesterday();

const httpReq = require('../httpReqTmpl');
//const getSecID = require('../../datasrc/wmcloud').getSecID;

const taskStatus = require('../../constants').taskStatus;

var run = function() {
    var loop = function() {
        setTimeout(() => {
            var today = time.today();
            var produceTime = time.today(config.produceTime);
            if(time.isAfter(time.now(), produceTime) && time.isAfter(today, lastProducedate)) {
                console.log('start to produce task...');
                //* find secID list to produce task
                return getTaskList().then((list) => {
                    console.log('# of stocks to update: ', list.length);
                    //* produce stock data update task
                    return insertUpdateTask(list).then((objIdMap) => {
                        //* objIdMap maps each secID to the object id.
                        //* produce simulate task. bind ready condition with the corresponding object id
                        return insertSimulateTask(list, objIdMap);
                    }).then(() => {
                        //* update produce date
                        return updateProducedate(list);
                    });
                }).then(() =>{
                    console.log('produce task finished');
                    lastProducedate = today;
                }, (err) => {
                    console.log('find error: ', err);
                    process.exit();
                }).then(loop);
            }
            else loop();
        }, config.produceInterval)
    };
    loop();
}

function getTaskList() {
    return Promise.all([getSecID(), getProducedate()]).then((r) => {
        var allList = r[0];
        var curList = r[1].reduce((pre, cur) => {
            pre[cur.secID] = {
                producedate: cur.producedate,
                status: cur.taskStatus,
            }
            return pre;
        }, {});
        var today = time.today();
        var updateList = allList.filter((secID) => {
            /**
             * new task will be created:
             * 1\ secID not exist in current producedateCol.
             * 2\ or, last producedate is before today and task status is not ready.
             */
            return !(secID in curList) || (time.isAfter(today, curList[secID].producedate) && curList[secID].status !== taskStatus.ready);
        }).map((secID) => secID.toLowerCase());
        return updateList;
    });
}

function getProducedate() {
    return httpReq('/producedate', { filter: {} }, 'find').then((r) => {
        return JSON.parse(r.toString());
    });
}

function getSecID() {
    return azure(config.azureUsr).getBlobToText('stockmeta', 'allstocks.txt').then((r) => {
        return r.toString().split(';');
    })
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
    return httpReq('/task', { docs: docs }, 'insertMany').then((r) => {
        var objIdMap = JSON.parse(r.toString()).ops.reduce((pre, cur) => {
            pre[cur.task.pack] = cur._id.toString();
            return pre;
        }, {});
        return objIdMap;
    })
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
    return httpReq('/task', { docs: docs }, 'insertMany');
}

/**
 * update the produce date to today.
 */
function updateProducedate(list) {
    var today = time.format(today, 'YYYYMMDD');
    var docs = list.map((secID) => {
        return {
            'filter': { secID: secID },
            'update': { $set: { producedate: today } }
        };
    });
    return docs.length === 0 ? Promise.resolve() : httpReq('/producedate', docs, 'upsertMany');
}

run();
