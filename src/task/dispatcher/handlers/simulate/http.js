
/**
 * simulate/http:
 * database operation on simulateCol and simdateCol
 */
const db = require('./db');
const simulateCol = db.simulateCol;
const simdateCol = db.simdateCol;
const dbOperation = require('../dbOperation');
const itemsPerPage = require('../../../../config').itemsPerPage;
const validate = require('../../../../utility').validate;

/**
 * http request sent to simulateCol
 * .isValid() check the validity of arg and verb.
 * .run() perform the actual request
 */
exports.simulate = {
    isValid: function (arg, verb) {
        if(verb === 'getMul') {
            return validate.isObj(arg) && validate.isObj(arg.filter)
            && validate.isPosInt(arg.pageNum) && validate.isPosInt(arg.pageSize) && validate.isUndefinedOrObj(arg.sort);
        }
        return (verb === 'find' || verb === 'updateMany' || verb === 'insert')
        && dbOperation.isValid(verb, arg);
    },
    run: function (arg, verb) {
        if(!exports.simulate.isValid(arg, verb)) {
            return Promise.reject(400);
        }
        if(verb === 'getMul') {
            return getMul(arg);
        }
        else {
            return dbOperation.run(simulateCol, arg, verb);
        }
    }
}

/**
 * http request sent to simdateCol
 * .isValid() check the validity of arg and verb
 * .run() perform the actual request
 */
exports.simdate = {
    isValid: function (arg, verb) {
        return (verb === 'findOne' || verb === 'upsert')
        && dbOperation.isValid(verb, arg);
    },
    run: function(arg, verb) {
        if(!exports.simdate.isValid(arg, verb)) {
            return Promise.reject(400);
        }
        return dbOperation.run(simdateCol, arg, verb);
    }
}

function getMul(arg) {
    var filter = arg.filter;
    var pageNum = arg.pageNum;
    var pageSize = Math.min(itemsPerPage.max, Math.max(arg.pageSize, itemsPerPage.min));
    var sort = arg.sort;

    return simulateCol.count(filter).then((r) => {
        var total = r;
        var totalPage = Math.floor(total / pageSize);
        pageNum = Math.min(pageNum, totalPage);
        var ret = {
            pageNum: pageNum,
            pageSize: pageSize,
            total: total,
        };
        if(pageNum === 0) {
            ret.data = [];
            return ret;
        }
        return simulateCol.findPagination(filter, pageNum, pageSize, sort).then((r) => {
            ret.data = r;
            return ret;
        })
    });
}