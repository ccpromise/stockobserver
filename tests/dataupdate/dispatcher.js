
// inital syncDate:
var db = require('../../src/dataupdate/db');

db.syncDate.remove({}).then((r) => {
    return db.task.remove({});
}).then((r) => {
    return db.syncDate.insertMany([{
        'secID': '000001.XSHE',
        'syncDate': '1991-01-01'
    }, {
        'secID': '000002.XSHE',
        'syncDate': '1991-01-01'
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
    var dis = require('../../src/dataupdate/dispatcher');
    var consumer = require('../../src/dataupdate/consumer');
    setTimeout(() => {
        db.syncDate.find({}).then((r) => {
            console.log(r);
            return db.task.find({});
        }).then((r) => {
            console.log(JSON.stringify(r));
            return dis.endConnection();
        })
    }, 60000);
}).catch((err) => console.log(err));
