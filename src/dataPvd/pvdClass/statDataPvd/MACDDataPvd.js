
var CachedDataPvd = require('../basicDataPvd').CachedDataPvd;
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
var validate = utility.validate;
var object = utility.object;

function MACDDataPvd(pvd, dif, dea, macd, id) {
    CachedDataPvd.call(this, id);
    this.pvd = pvd;
    this._dif = dif;
    this._dea = dea;
    this._macd = macd;
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

// {'pvd': , 'paras': }
function checkParams(paraObj) {
    if(!validate.isObj(paraObj) || object.numOfKeys(paraObj) !== 4 ||
    !validate.isPosInt(paraObj.Nl) || !validate.isPosInt(paraObj.Ns) || !validate.isPosInt(paraObj.Na))
        return false;
    return pvdGenerator.checkldp(paraObj.pvd);
}

function pvdID(paraObj) {
    return 'macd' + '_' + paraObj.Nl + '_' + paraObj.Ns + '_' + paraObj.Na + '_' + pvdGenerator.pvdID(paraObj.pvd);
}

function makePvd(paraObj, id) {
    return pvdGenerator.makePvd(paraObj.pvd).then((pvd) => {
        var ema1 = {'type': 'ema', 'pack': {'N': paraObj.Nl, 'pvd': pvd}};
        var ema2 = {'type': 'ema', 'pack': {'N': paraObj.Ns, 'pvd': pvd}};
        var dif = {'type': 'sub', 'pack': {'pvds': [ema1, ema2], 'idx': 1}};
        return pvdGenerator.makePvd(dif).then((difPvd) => {
            var dea = {'type': 'ema', 'pack': {'N': paraObj.Na, 'pvd': difPvd}};
            return pvdGenerator.makePvd(dea).then((deaPvd) => {
                var macd = {'type': 'sub', 'pack': {'pvds': [difPvd, deaPvd], 'idx': 0}};
                return pvdGenerator.makePvd(macd).then((macdPvd) => {
                    return new MACDDataPvd(pvd, difPvd, deaPvd, macdPvd, id);
                });
            });
        });
    });
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
}
