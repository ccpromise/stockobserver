
/**
 * simulate/http:
 * database operation on simulateCol and simdateCol
 */
const db = require('./db');
const simulateCol = db.simulateCol;
const simdateCol = db.simdateCol;
const dbOperation = require('../dbOperation');

exports.simulate = function(arg, verb, res, req) {
    if(verb === 'getMul') {
        getSimData(arg, req, res);
    }
    else if(verb === 'getTotal') {
        getTotalSim(arg, req, res);
    }
    else dbOperation(simulateCol, arg, verb, res);
}

exports.simdate = function(arg, verb, res) {
    dbOperation(simdateCol, arg, verb, res);
}

function getSimData(arg, req, res) {
    var pageNum = arg.pageNum;
    var pageSize = arg.pageSize;
    var filter = arg.filter;
    var sort = arg.sort;
    simulateCol.findPagination(filter, sort, pageNum, pageSize).then((r) => {
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

function getTotalSim(arg, req, res) {
    simulateCol.find(arg).then((r) => {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
            'Access-Control-Allow-Method': req.headers['access-control-request-method'],
            'Content-type': 'application/json'
        });
        res.end(JSON.stringify(r.length));
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
