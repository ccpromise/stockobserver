
var StatDataPvd = require('./StatDataPvd');
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
var validate = utility.validate;
var statistics = utility.statistics;
var object = utility.object;

function StdDataPvd(pvd, N, id) {
    StatDataPvd.call(this, pvd, N, id);
}

StdDataPvd.prototype = Object.create(StatDataPvd.prototype);

StdDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid its');
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n --;
    }
    return Statistics.std(data);
}

function checkParams(paramObj) {
    if(!validate.isObj(paramObj) || object.numOfKeys(paramObj) !== 2 || !validate.isPosInt(paramObj.N)) return false;
    return pvdGenerator.checkldp(paramObj.pvd);
}

function pvdID(paramObj) {
    return 'std' + '_' + paramObj.N + '__' + pvdGenerator.pvdID(paramObj.pvd);
}

/**
 * referenceID: key - this.id
 *              value - this.pvd.id
 */
var referenceID = new Map();
function makePvd(paramObj, id) {
    var refPvdID = pvdGenerator.pvdID(paramObj.pvd);
    referenceID.set(id, new Set([refPvdID]));
    return pvdGenerator.makePvd(paramObj.pvd).then((subPvd) => {
        return new StdDataPvd(subPvd, paramObj.N, id);
    });
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd,
    'refPvdIDs': function(id) {
        return referenceID.get(id);
    }
}
