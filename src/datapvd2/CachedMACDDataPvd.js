
var CachedDataPvd = require('./CachedDataPvd');
var CachedEMADataPvd = require('./CachedEMADataPvd');
var SubDataPvd = require('./SubDataPvd');

function CachedMACDDataPvd(pvd) {
    CachedDataPvd.call(this);
    this.pvd = pvd;
    var ema12 = new CachedEMADataPvd(pvd, 12);
    var ema26 = new CachedEMADataPvd(pvd, 26); // duplicate computation
    this._dif = new SubDataPvd(ema12, ema26);
    this._dea = new CachedEMADataPvd(this._dif, 9);
    this._macd = new SubDataPvd(this._dif, this._dea);
    this.minTs = this._dif.minTs;
    this.maxTs = this._dif.maxTs;
}

CachedMACDDataPvd.prototype = Object.create(CachedDataPvd.prototype);

CachedMACDDataPvd.prototype.hasDef = function(ts) {
    return this._dif.hasDef(ts);
}

CachedMACDDataPvd.prototype.getUncached = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    return {
        'DIF': this._dif.get(ts),
        'DEA': this._dea.get(ts),
        'MACD': this._macd.get(ts)
    }
}

CachedMACDDataPvd.prototype.forwardDateTs = function(ts) {
    return this.pvd.forwardDateTs(ts);
}

CachedMACDDataPvd.prototype.backwardDateTs = function(ts) {
    return this.pvd.backwardDateTs(ts);
}

module.exports = CachedMACDDataPvd;
