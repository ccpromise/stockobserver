
/**
 * simulate/http:
 * database operation on simulateCol and simdateCol
 */
const db = require('./db');
const simulateCol = db.simulateCol;
const simdateCol = db.simdateCol;
const dbOperation = require('../dbOperation');

exports.simulate = function(arg, verb, res, req) {
    if(verb === 'getMul' || verb === 'getOne' || verb === 'getAll' || verb === 'count') {
        corsReq(verb, arg, req, res);
    }
    else dbOperation(simulateCol, arg, verb, res);
}

exports.simdate = function(arg, verb, res) {
    dbOperation(simdateCol, arg, verb, res);
}

function corsReq(verb, arg, req, res) {
    var filter = arg.filter;
    var pageNum = arg.pageNum;
    var pageSize = arg.pageSize;
    var sort = arg.sort;
    var promise = null;
    if(verb === 'count') {
        promise = simulateCol.count();
    }
    else if(verb === 'getAll') {
        promise = simulateCol.find(filter, null, sort);
    }
    else {
        promise = simulateCol.findPagination(filter, verb === 'getOne' ? 1 : pageNum, verb === 'getOne' ? 1 : pageSize, sort);
    }
    promise.then((r) => {
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
    })
}
