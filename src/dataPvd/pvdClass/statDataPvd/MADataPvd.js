
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

// paraObj: {'N':, 'pvd': pvdX}
// paraObj: {'N': , 'pvd': {type: , pack: }}
function checkParams(paraObj) {
    if(!validate.isObj(paraObj) || object.numOfKeys(paraObj) !== 2 || !validate.isPosInt(paraObj.N)) return false;
    return pvdGenerator.checkldp(paraObj.pvd);
}

function pvdID(paraObj) {
    return 'ma' + '_' + paraObj.N + '__' + pvdGenerator.pvdID(paraObj.pvd);
}

function makePvd(paraObj, id) {
    return pvdGenerator.makePvd(paraObj.pvd).then((subPvd) => {
        return new MADataPvd(subPvd, paraObj.N, id);
    });
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
}
