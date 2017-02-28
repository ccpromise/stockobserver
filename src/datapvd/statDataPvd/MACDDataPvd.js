
var CachedDataPvd = require('../basicDataPvd/CachedDataPvd');
var EMADataPvd = require('./EMADataPvd');
var SubDataPvd = require('../combinedDataPvd/SubDataPvd');
var paras = require('../../config').macdParas;

function MACDDataPvd(pvd) {
    CachedDataPvd.call(this);
    this.pvd = pvd;
    var ema12 = new EMADataPvd(pvd, paras[0]);
    var ema26 = new EMADataPvd(pvd, paras[1]); // duplicate computation
    this._dif = new SubDataPvd([ema12, ema26], 1);
    this._dea = new EMADataPvd(this._dif, paras[2]);
    this._macd = new SubDataPvd([this._dif, this._dea], 0);
    this.minTs = this._dif.minTs;
    this.maxTs = this._dif.maxTs;
}

MACDDataPvd.prototype = Object.create(CachedDataPvd.prototype);

MACDDataPvd.prototype.hasDef = function(ts) {
    return this._dif.hasDef(ts);
}

MACDDataPvd.prototype._calculate = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return {
        'DIF': this._dif.get(ts),
        'DEA': this._dea.get(ts),
        'MACD': this._macd.get(ts)
    }
}

MACDDataPvd.prototype.forwardDateTs = function(ts) {
    return this.pvd.forwardDateTs(ts);
}

MACDDataPvd.prototype.backwardDateTs = function(ts) {
    return this.pvd.backwardDateTs(ts);
}

module.exports = MACDDataPvd;
