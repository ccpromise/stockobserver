
var utility = require('../utility');
var Database = utility.database;
var time = utility.time;
var mongoUrl = require('../config').mongoUrl;

// create database and collection
var db = new Database(mongoUrl);
var syncDate = db.getCollection('syncDate', { 'secID': true, 'date': true });
var task = db.getCollection('task', { 'secID': true, 'status': true, 'time': true });

// TODO: initiate syncDate, for all secID, date is the minimal.

// ensure secID of each document is unique.
syncDate.createIndex({ secID: "text" }, { unique:true, background:true }).catch((err) => { console.log(err); });

// return the last sync date of secID
syncDate.get = function(secID) {
    return syncDate.find({ 'secID': secID }, { 'date': true }).then((arr) => {
        if(arr.length !== 1) throw new Error('secID is not unique');
        return arr[0].date;
    });
}

// set the last sync date of secID
syncDate.set = function(secID, date) {
    return syncDate.findAndModify({ 'secID': secID}, [], { $set: { 'date':date } }, {});
}

//================================
// insert a new ready task
task.insertTask = function(secID) {
    return task.insert({ 'secID': secID, 'status': 0, 'time': time.valueOf(time.now()) });
}

exports.syncDate = syncDate;
exports.task = task;
