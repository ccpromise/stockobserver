
const StatDataPvd = require('./StatDataPvd');
const pvdGenerator = require('../../../dataPvd/makeDataPvd');
const utility = require('../../../utility');
const statistics = utility.statistics;
const validate = utility.validate;
const object = utility.object;
const k = require('../../../config').bollingerK;

function BollDataPvd(pvd, N, id) {
    StatDataPvd.call(this, pvd, N, id);
}

BollDataPvd.prototype = Object.create(StatDataPvd.prototype);

BollDataPvd.prototype._calculate = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n--;
    }
    var avg = statistics.mean(data);
    var std = statistics.std(data);
    return {
        'MA': avg,
        'UP': avg + k * std,
        'DW': avg - k * std
    };
}

function checkParams(paramObj) {
    if(!validate.isObj(paramObj) || object.numOfKeys(paramObj) !== 2 || !validate.isPosInt(paramObj.N)) return false;
    return pvdGenerator.checkldp(paramObj.pvd);
}

function pvdID(paramObj) {
    return 'boll' + '_' + paramObj.N + '_' + pvdGenerator.pvdID(paramObj.pvd);
}

/**
 * referenceID: key - this.id
 *              value - this.pvd.id
 */
var referenceID = new Map();
function makePvd(paramObj, id) {
    var refPvdID = pvdGenerator.pvdID(paramObj.pvd);
    referenceID.set(id, new Set([refPvdID]));
    return pvdGenerator.makePvd(paramObj.pvd).then((pvd) => {
        return new BollDataPvd(pvd, paramObj.N, id);
    });
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd,
    'refPvdIDs': function(id) {
        return referenceID.get(id);
    }
};
