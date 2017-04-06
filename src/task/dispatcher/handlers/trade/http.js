
/**
 * handler of http request to query trade plan collection
 */
const tradeplanCol = require('./db').tradeplanCol;
const dbOperation = require('../dbOperation');
const map = {
    'findOne': true
}

/**
 * http request sent to tradeplanCol
 * .isValid() check the validity of arg and verb
 * .run() perform the actual request
 */
exports.tradeplan = {
    isValid: function (arg, verb) {
        return verb === 'findOne' && dbOperation.isValid(verb, arg);
    },
    run: function (arg, verb) {
        if(!exports.tradeplan.isValid(arg, verb)) {
            return Promise.reject(400);
        }
        return dbOperation.run(tradeplanCol, arg, verb);
    }
}
