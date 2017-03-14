
var getStockList = require('./getStockList');
var config = require('../config');
var taskStatus = config.constants.taskStatus;
var db = require('./db');
var time = require('../utility').time;
var isConnected = false;

function dispatcher() {
    this.db = db.database;
    this.syncDate = db.syncDate;
    this.task = db.task;
    this.syncTime = config.stockSyncTime;
    this.lastSyncDate = time.yesterday();
    this.setProducer().catch((err) => console.log(err));
    this.clearTimeout().catch((err) => console.log(err));
    isConnected = true;
}

dispatcher.prototype.setProducer = function () {
    var loop = function(that) {
        setTimeout(() => {
            if(!isConnected) return;
            var syncTime = time.today('YYYY-MM-DD') + ' ' + that.syncTime;
            if(that.lastSyncDate !== time.today() && time.isAfter(time.now(), syncTime)) {
                that.syncDate.find({}).then((list) => {
                    var idArr = [];
                    list.forEach((stock) => {
                        if(time.isAfter(time.today(), stock.syncDate))
                            idArr.push(stock.secID);
                    });
                    Promise.all([that.task.insertTask(idArr), that.syncDate.updateSyncDate(idArr)]).then(() => {
                        that.lastSyncDate = time.today();
                        loop(that);
                    });
                });
            }
            else loop(that);
        }, 5000);
    };
    return Promise.resolve().then(() => loop(this));
}

dispatcher.prototype.clearTimeout = function () {
    var innerLoop = function(that) {
        if(!isConnected) return;
        that.task.clearTimeout().then((r) => {
            if(r.result.nModified === 1) {
                innerLoop(that);
            }
            else loop(that);
        });
    };
    var loop = function(that) {
        setTimeout(() => {
            innerLoop(that);
        }, 5000);
    }
    return Promise.resolve().then(() => loop(this));
}

dispatcher.prototype.endConnection = function () {
    isConnected = false;
    return this.db.close();
}

module.exports = dispatcher;
