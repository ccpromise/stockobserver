
var db = require('../../db');
var strategy = require('../../../../strategy/tradeplan');
var tradeplanCol = db.getCollection('tradeplan', { '_id': true, 'tradeplanId': true, 'desc': true, 'dpInTmpl': true, 'dpOutTmpl': true });
/*
tradeplanCol.remove({}).then(() => {
    return tradeplanCol.insertMany(Object.values(strategy));
}).then(() => {
    tradeplanCol.find({}).then(console.log);
})*/

exports.tradeplanCol = tradeplanCol;
