
var StatDataPvd = require('./StatDataPvd');
var pvdGenerator = require('../../dataPvdGenerator').pvdGenerator;
var utility = require('../../utility');
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

function checkParas(paraObj) {
    if(!validate.isObj(paraObj) || object.numOfKeys(paraObj) !== 2 || !validate.isPosNum(paraObj.N)) return false;
    if(validate.isDataPvd(paraObj.pvd)) return true;
    return pvdGenerator.checkParas(paraObj.pvd);
}

function pvdID(paraObj) {
    var subID = validate.isDataPvd(paraObj.pvd) ? paraObj.pvd.id : pvdGenerator.pvdID(paraObj.pvd);
    return 'std' + '_' + paraObj.N + '__' + subID;
}

function makePvd(paraObj, id) {
    var subPvd = validate.isDataPvd(paraObj.pvd) ? Promise.resolve(paraObj.pvd) : pvdGenerator.makePvd(paraObj.pvd);
    return subPvd.then((pvd) => {
        return new StdDataPvd(pvd, paraObj.N, id);
    })
}

module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
