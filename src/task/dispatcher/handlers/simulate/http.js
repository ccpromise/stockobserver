
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
            return validate.isObj(arg.filter) && validate.isPosInt(arg.pageNum) && validate.isPosInt(arg.pageSize);
        }
        return (verb === 'find' || verb === 'updateMany' || verb === 'insert')
        && dbOperation.isValid(verb, arg);
    },
    run: function (arg, verb, res, req) {
        if(!exports.simulate.isValid(arg, verb)) {
            res.writeHead(400);
            res.end();
            return Promise.resolve();
        }
        if(verb === 'getMul') {
            return corsReq(verb, arg, req, res);
        }
        else {
            return dbOperation.run(simulateCol, arg, verb, res);
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
    run: function(arg, verb, res) {
        if(!exports.simdate.isValid(arg, verb)) {
            res.writeHead(400);
            res.end();
        }
        return dbOperation.run(simdateCol, arg, verb, res);
    }
}

/**
 * http request from other domain
 */
function corsReq(verb, arg, req, res) {
    var filter = arg.filter;
    var pageNum = arg.pageNum;
    var pageSize = Math.min(itemsPerPage.max, Math.max(arg.pageSize, itemsPerPage.min));
    var sort = arg.sort;
    var promise = null;

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
    }).then((r) => {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
            'Access-Control-Allow-Method': req.headers['access-control-request-method'],
            'Content-type': 'application/json'
        });
        res.end(JSON.stringify(r));
    }).catch((err) => {
        res.writeHead(500, {
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
            'Access-Control-Allow-Method': req.headers['access-control-request-method'],
            'Content-type': 'application/json'
        });
        res.end();
    });
}
