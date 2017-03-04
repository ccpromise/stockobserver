
var DataPvd = require('./DataPvd');
var pvdGenerator = require('../../dataPvdGenerator');
var utility = require('../../utility');
var validate = utility.validate;
var object = utility.object;

function OffsetDataPvd(pvd, N, id) {
    DataPvd.call(this, id);
    if(N >= 0) {
        this.maxTs = pvd.backwardDateTs(pvd.maxTs, N);
        this.minTs = this.maxTs == -1 ? -1 : pvd.minTs;
    }
    else {
        this.minTs = pvd.forwardDateTs(pvd.minTs, -N);
        this.maxTs = this.minTs == -1 ? -1 : pvd.maxTs;
    }
    this.N = N;
    this.pvd = pvd;
}

OffsetDataPvd.prototype = Object.create(DataPvd.prototype);

OffsetDataPvd.prototype.hasDef = function(ts) {
    var realTs = this.N > 0 ? this.pvd.forwardDateTs(ts, this.N) : this.pvd.backwardDateTs(ts, -this.N);
    return this.pvd.hasDef(realTs);
}

OffsetDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    var realTs = this.N > 0 ? this.pvd.forwardDateTs(ts, this.N) : this.pvd.backwardDateTs(ts, -this.N);
    return this.pvd.get(realTs);
}

OffsetDataPvd.prototype.forwardDateTs = function(ts, n) {
    return this.pvd.forwardDateTs(ts, n);
}

OffsetDataPvd.prototype.backwardDateTs = function(ts, n) {
    return this.pvd.backwardDateTs(ts, n);
}

function checkParas(paraObj) {
    if(!(validate.isObj(paraObj) && object.numOfKeys(paraObj) === 2 && validate.isNum(paraObj.N))) return false;
    if(validate.isDataPvd(paraObj.pvd)) return true;
    return pvdGenerator.pvdGenerator.checkParas(paraObj.pvd);
}

function pvdID(paraObj) {
    var subID = validate.isDataPvd(paraObj.pvd) ? paraObj.pvd.id : pvdGenerator.pvdGenerator.pvdID(paraObj.pvd);
    return 'offset' + '_' + paraObj.N + '_' + subID;
}

function makePvd(paraObj, id) {
    var subPvd = validate.isDataPvd(paraObj.pvd) ? Promise.resolve(paraObj.pvd) : pvdGenerator.pvdGenerator.makePvd(paraObj.pvd);
    return subPvd.then((pvd) => {
        return new OffsetDataPvd(pvd, paraObj.N, id);
    });
}

module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
