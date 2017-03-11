
var getStockList = require('./getStockList');
var config = require('../config');
var db = require('./db');

function dispatcher() {
    this.syncDate = db.syncDate;
    this.task = db.task;
    this.syncTime = config.stockSyncTime;
    this.timeout = config.stockTimeout;
    setProducer();
    clearTimeout();
}

function setProducer() {
    var loop = function() {
        setTimeout(() => {
            var syncTime = time.today('YYYY-MM-DD') + ' ' + this.syncTime;
            if(time.isAfter(time.now(), syncTime)) {
                getStockList.then((list) => {
                    var promises = list.map((secID) => {
                        return this.syncDate.get(secID).then((date) => {
                            if(time.isAfter(time.today(), date)) {
                                // remove the task which is still prepared or processing of this secID.
                                return this.task.remove({ 'secID': secID, { $or: [{ 'status': 0 }, { 'status': 1 }] } }).then(() => {
                                    // insert the new task
                                    return this.task.insertTask(secID).then(() => {
                                        // update the task build date.
                                        return this.syncDate.set(secID, time.today());
                                    });
                                });
                            }
                            return Promise.resolve();
                        });
                    });
                    return Promise.all(promises);
                }).then(loop);
            }
            else loop();
        }, 5000);
    }
    loop();
}

function clearTimeout() {
    var loop = function() {
        setTimeout(() => {
            // if status is processing and time out, set the status to ready
            this.task.findAndModify({
                'status': 1, 'time': { $lt time.valueOf(time.now())-this.timeout }
            }, [['time', 1]], { $set:{ 'status': 0, 'time': time.valueOf(time.now())} }, {}).then(loop);
        }, 300000);
    }
    loop();
}

dispatcher.prototype.getReadySecID = function() {
    return this.task.findAndModify({ 'status': 0 }, { $set: { 'status': 1, 'time': time.valueOf(time.now()) } }, {}).then((r) => {
        return r === null ? null : r.secID;
    });
}

dispatcher.prototype.finishTask = function(secID, result, err) {
    var setField = result === 'success' ? { 'status': 2, 'time': time.now() } : { 'status': -1, 'err': err, 'time': time.now() };
    return this.task.findOneAndUpdate({ 'secID': secID, 'status': 1 }, { $set: setField });
}

module.exports = dispatcher;
