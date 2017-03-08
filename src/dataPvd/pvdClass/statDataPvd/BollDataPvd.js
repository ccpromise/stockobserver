
var StatDataPvd = require('./StatDataPvd');
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
var statistics = utility.statistics;
var validate = utility.validate;
var object = utility.object;
var k = require('../../../config').bollingerK;

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

var pendingPromise = {};
function makePvd(paramObj, id) {
    if(!(id in pendingPromise)) {
        var promise = pvdGenerator.makePvd(paramObj.pvd).then((pvd) => {
            delete pendingPromise[id];
            return new BollDataPvd(pvd, paramObj.N, id);
        });
        pendingPromise[id] = promise;
    }
    return pendingPromise[id];
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
}
