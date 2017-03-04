
var StatDataPvd = require('./StatDataPvd');
var pvdGenerator = require('../../dataPvdGenerator');
var utility = require('../../utility');
var statistics = utility.statistics;
var validate = utility.validate;
var object = utility.object;
var k = require('../../config').bollingerK;

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

function checkParas(paraObj) {
    if(!validate.isObj(paraObj) || object.numOfKeys(paraObj) !== 2 || !validate.isPosNum(paraObj.N)) return false;
    if(validate.isDataPvd(paraObj.pvd)) return true;
    return pvdGenerator.pvdGenerator.checkParas(paraObj.pvd);
}

function pvdID(paraObj) {
    var subID = validate.isDataPvd(paraObj.pvd) ? paraObj.pvd.id : pvdGenerator.pvdGenerator.pvdID(paraObj.pvd);
    return 'boll' + '_' + paraObj.N + '_' + subID;
}

function makePvd(paraObj, id) {
    var subPvd = validate.isDataPvd(paraObj.pvd) ? Promise.resolve(paraObj.pvd) : pvdGenerator.pvdGenerator.makePvd(paraObj.pvd);
    return subPvd.then((pvd) => {
        return new BollDataPvd(pvd, paraObj.N, id);
    })
}

module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
