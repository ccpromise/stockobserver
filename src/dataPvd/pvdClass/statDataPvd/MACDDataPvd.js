
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
function checkParams(paramObj) {
    if(!validate.isObj(paramObj) || object.numOfKeys(paramObj) !== 4 ||
    !validate.isPosInt(paramObj.Nl) || !validate.isPosInt(paramObj.Ns) || !validate.isPosInt(paramObj.Na))
        return false;
    return pvdGenerator.checkldp(paramObj.pvd);
}

function pvdID(paramObj) {
    return 'macd' + '_' + paramObj.Nl + '_' + paramObj.Ns + '_' + paramObj.Na + '_' + pvdGenerator.pvdID(paramObj.pvd);
}

function makePvd(paramObj, id) {
    return pvdGenerator.makePvd(paramObj.pvd).then((pvd) => {
        var ema1 = {'type': 'ema', 'pack': {'N': paramObj.Nl, 'pvd': pvd}};
        var ema2 = {'type': 'ema', 'pack': {'N': paramObj.Ns, 'pvd': pvd}};
        var dif = {'type': 'sub', 'pack': {'pvds': [ema1, ema2], 'idx': 1}};
        return pvdGenerator.makePvd(dif).then((difPvd) => {
            var dea = {'type': 'ema', 'pack': {'N': paramObj.Na, 'pvd': difPvd}};
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
