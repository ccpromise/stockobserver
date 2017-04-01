
/**
 * trade plan collection
 */
const db = require('../db');
const plans = require('../../../strategy/tradeplan');
const tradeplanCol = db.getCollection('tradeplan', {
    '_id': true,
    'desc': true,
    'dpInTmpl': true,
    'dpOutTmpl': true
});

/**
 * initial trade plan collection
 */
tradeplanCol.find({}).then((docs) => {
    var allPlans = Object.keys(plans);
    var curPlans = docs.reduce((pre, cur) => {
        pre[cur._id] = true;
        return pre;
    }, {});
    var newPlans = allPlans.filter((planId) => !(planId in curPlans));
    return newPlans.length === 0 ? Promise.resolve() : tradeplanCol.insertMany(newPlans.map((id) => plans[id]));
});

exports.tradeplanCol = tradeplanCol;
