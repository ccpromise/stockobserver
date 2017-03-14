
// inital syncDate:
var db = require('../../src/dataupdate/db');
var dispatcher = require('../../src/dataupdate/dispatcher');

db.syncDate.remove({}).then((r) => {
    return db.task.remove({});
}).then((r) => {
    return db.syncDate.insertMany([{
        'secID': '000001.XSHE',
        'syncDate': '19910101'
    }, {
        'secID': '000002.XSHE',
        'syncDate': '19910101'
    }]);
}).then(() => {
    console.log('inital database: ');
    return db.syncDate.find({}).then((r) => {
        console.log(r);
        return db.task.find({}).then((r) => {
            console.log(r);
        })
    })
}).then(() => {
    var dis = new dispatcher();
    setTimeout(() => {
        db.syncDate.find({}).then((r) => {
            console.log(r);
            return db.task.find({});
        }).then((r) => {
            console.log(r);
            return dis.endConnection();
        })
    }, 30000);
})
