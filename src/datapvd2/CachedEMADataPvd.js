
var CachedDataPvd = require('./CachedDataPvd');

function CachedEMADataPvd(pvd, N) {
    CachedDataPvd.call(this);
    this.minTs = pvd.minTs;
    this.maxTs = pvd.maxTs;
    this.pvd = pvd;
    this.smoothnessIndex = 2 / (N+1);
}

CachedEMADataPvd.prototype = Object.create(CachedDataPvd.prototype);

CachedEMADataPvd.prototype.hasDef = function(ts) {
    return this.pvd.hasDef(ts);
}

CachedEMADataPvd.prototype.getUncached = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    var ema = 0;
    var k = 1;
    while(this.pvd.hasDef(ts)) {
        var cacheData = this.getCached(ts);
        if(cacheData !== undefined){
            ema += cacheData / this.smoothnessIndex * k;
            return ema * this.smoothnessIndex;
        }
        ema += k * this.pvd.get(ts);
        ts = this.pvd.backwardDateTs(ts, 1);
        k *= (1 - this.smoothnessIndex);
    }
    return ema * this.smoothnessIndex;
}

CachedEMADataPvd.prototype.forwardDateTs = function(ts, n) {
    return this.pvd.forwardDateTs(ts, n);
}

CachedEMADataPvd.prototype.backwardDateTs = function(ts, n) {
    return this.pvd.backwardDateTs(ts, n);
}

module.exports = CachedEMADataPvd;
