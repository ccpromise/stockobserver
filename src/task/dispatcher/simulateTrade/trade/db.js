
var db = require('../../db');
var strategy = require('../../../../strategy/tradeplan');
var tradeplanCol = db.getCollection('tradeplan', { '_id': true, 'desc': true, 'dpInTmpl': true, 'dpOutTmpl': true });

/* init
tradeplanCol.remove({}).then(() => {
    return tradeplanCol.insertMany(Object.values(strategy));
}).then(() => {
    tradeplanCol.find({}).then((r) => console.log(JSON.stringify(r)));
});
*/

exports.tradeplanCol = tradeplanCol;
