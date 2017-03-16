
// inital syncDate:
var db = require('../../src/dataupdate/db');
var dis = require('../../src/dataupdate/dispatcher');
var consumer = require('../../src/dataupdate/consumer');

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
    dis.setProducer().catch((err) => console.log(err));
    dis.clearTimeout().catch((err) => console.log(err));
    dis.createServer()
    consumer.getTask().catch((err) => console.log(err));
    setTimeout(() => {
        db.syncDate.find({}).then((r) => {
            console.log(r);
            return db.task.find({});
        }).then((r) => {
            console.log(JSON.stringify(r));
            return dis.endConnection();
        })
    }, 60000);
})
