
var CachedDataPvd = require('../basicDataPvd').CachedDataPvd;
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
var validate = utility.validate;
var object = utility.object;

function EMADataPvd(pvd, N, id) {
    CachedDataPvd.call(this, id);

    this.minTs = pvd.minTs;
    this.maxTs = pvd.maxTs;
    this.pvd = pvd;
    this.smoothnessIndex = 2 / (N+1);
}

EMADataPvd.prototype = Object.create(CachedDataPvd.prototype);

EMADataPvd.prototype.hasDef = function(ts) {
    return this.pvd.hasDef(ts);
}

EMADataPvd.prototype._calculate = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    var ema = this.pvd.get(this.minTs);
    var i = this.pvd.forwardDateTs(this.minTs, 1);

    if(this._cache.size() != 0) {
        var lo = i;
        var hi = ts;
        while(lo <= hi) {
            var mid = this.pvd.forwardDateTs(Math.floor((lo+hi)/2), 0);
            if(this._cache.has(mid)){
                lo = this.pvd.forwardDateTs(mid, 1);
            }
            else {
                hi = this.pvd.backwardDateTs(mid, 1);
            }
        }
        ema = this._cache.get(this.pvd.backwardDateTs(lo, 1));
        i = lo;
    }

    while(this.pvd.hasDef(i) && i <= ts) {
        ema = this.smoothnessIndex * this.pvd.get(i) + (1 - this.smoothnessIndex) * ema;
        this._cache.set(i, ema);
        i = this.pvd.forwardDateTs(i, 1);
    }
    return ema;
}

EMADataPvd.prototype.forwardDateTs = function(ts, n) {
    return this.pvd.forwardDateTs(ts, n);
}

EMADataPvd.prototype.backwardDateTs = function(ts, n) {
    return this.pvd.backwardDateTs(ts, n);
}

// {'pvd': , 'N':}
function checkParams(paramObj) {
    if(!validate.isObj(paramObj) || object.numOfKeys(paramObj) !== 2 || !validate.isPosInt(paramObj.N)) return false;
    return pvdGenerator.checkldp(paramObj.pvd);
}

function pvdID(paramObj) {
    return 'ema' + '_' + paramObj.N + '_' + pvdGenerator.pvdID(paramObj.pvd);
}

function makePvd(paramObj, id) {
    return pvdGenerator.makePvd(paramObj.pvd).then((pvd) => {
        return new EMADataPvd(pvd, paramObj.N, id);
    });
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
};