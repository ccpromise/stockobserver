
var StatDataPvd = require('./StatDataPvd');
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
var validate = utility.validate;
var statistics = utility.statistics;
var object = utility.object;

function MADataPvd(pvd, N, id) {
    StatDataPvd.call(this, pvd, N, id);
}

MADataPvd.prototype = Object.create(StatDataPvd.prototype);

MADataPvd.prototype._calculate = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts!');
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n--;
    }
    return statistics.mean(data);
}

// paramObj: {'N':, 'pvd': pvdX}
// paramObj: {'N': , 'pvd': {type: , pack: }}
function checkParams(paramObj) {
    if(!validate.isObj(paramObj) || object.numOfKeys(paramObj) !== 2 || !validate.isPosInt(paramObj.N)) return false;
    return pvdGenerator.checkldp(paramObj.pvd);
}

function pvdID(paramObj) {
    return 'ma' + '_' + paramObj.N + '__' + pvdGenerator.pvdID(paramObj.pvd);
}

var pendingPromise = {};
function makePvd(paramObj, id) {
    if(!(id in pendingPromise)) {
        var promise = pvdGenerator.makePvd(paramObj.pvd).then((subPvd) => {
            delete pendingPromise[id];
            return new MADataPvd(subPvd, paramObj.N, id);
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
