
/**
 * handler of http request to query trade plan collection
 */
const tradeplanCol = require('./db').tradeplanCol;
const dbOperation = require('../dbOperation');
const map = {
    'findOne': true
}

exports.tradeplan = {
    isValid: function (arg, verb) {
        return verb === 'findOne' && dbOperation.isValid(verb, arg);
    },
    run: function (arg, verb, res) {
        if(!exports.tradeplan.isValid(arg, verb)) {
            res.writeHead(400);
            res.end();
            return Promise.resolve();
        }
        return dbOperation.run(tradeplanCol, arg, verb, res);
    }
}
