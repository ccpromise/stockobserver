
var DataPvd = require('./DataPvd');
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
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

function checkParams(paramObj) {
    if(!(validate.isObj(paramObj) && object.numOfKeys(paramObj) === 2 && validate.isInt(paramObj.N))) return false;
    return pvdGenerator.checkldp(paramObj.pvd);
}

function pvdID(paramObj) {
    return 'offset' + '_' + paramObj.N + '_' + pvdGenerator.pvdID(paramObj.pvd);
}

var pendingPromise = {};
function makePvd(paramObj, id) {
    if(!(id in pendingPromise)){
        var promise = pvdGenerator.makePvd(paramObj.pvd).then((pvd) => {
            delete pendingPromise[id];
            return new OffsetDataPvd(pvd, paramObj.N, id);
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
