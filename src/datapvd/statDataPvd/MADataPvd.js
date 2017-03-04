
var StatDataPvd = require('./StatDataPvd');
var pvdGenerator = require('../../dataPvdGenerator');
var utility = require('../../utility');
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
function checkParas(paraObj) {
    if(!validate.isObj(paraObj) || object.numOfKeys(paraObj) !== 2 || !validate.isPosNum(paraObj.N)) return false;
    if(validate.isDataPvd(paraObj.pvd)) return true;
    return pvdGenerator.pvdGenerator.checkParas(paraObj.pvd);
}

function pvdID(paraObj) {
    var subID = validate.isDataPvd(paraObj.pvd) ? paraObj.pvd.id : pvdGenerator.pvdGenerator.pvdID(paraObj.pvd);
    return 'ma' + '_' + paraObj.N + '__' + subID;
}

function makePvd(paraObj, id) {
    var subPvd = validate.isDataPvd(paraObj.pvd) ? Promise.resolve(paraObj.pvd) : pvdGenerator.pvdGenerator.makePvd(paraObj.pvd);
    return subPvd.then((pvd) => {
        return new MADataPvd(pvd, paraObj.N, id);
    })
}

module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
