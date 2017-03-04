
var CachedDataPvd = require('../basicDataPvd').CachedDataPvd;
var pvdGenerator = require('../../dataPvdGenerator');
var utility = require('../../utility');
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
function checkParas(paraObj) {
    if(!validate.isObj(paraObj) || object.numOfKeys(paraObj) !== 2 ||
    !validate.isObj(paraObj.paras) || object.numOfKeys(paraObj.paras) !== 3 ||
    !validate.isNonNegNum(paraObj.paras.Nl) || !validate.isNonNegNum(paraObj.paras.Ns) || !validate.isNonNegNum(paraObj.paras.Na))
        return false;
    if(validate.isDataPvd(paraObj.pvd)) return true;
    return pvdGenerator.pvdGenerator.checkParas(paraObj.pvd);
}

function pvdID(paraObj) {
    var subID = validate.isDataPvd(paraObj.pvd) ? paraObj.pvd.id : pvdGenerator.pvdGenerator.pvdID(paraObj.pvd);
    return 'macd' + '_' + paraObj.paras.Nl + '_' + paraObj.paras.Ns + '_' + paraObj.paras.Na + '_' + subID;
}

function makePvd(paraObj, id) {
    return (validate.isDataPvd(paraObj.pvd) ? Promise.resolve(paraObj.pvd) : pvdGenerator.pvdGenerator.makePvd(paraObj.pvd)).then((pvd) => {
        var ema1 = {'type': 'ema', 'pack': {'N': paraObj.paras.Nl, 'pvd': pvd}};
        var ema2 = {'type': 'ema', 'pack': {'N': paraObj.paras.Ns, 'pvd': pvd}};
        var dif = {'type': 'sub', 'pack': {'pvds': [ema1, ema2], 'idx': 1}};
        return pvdGenerator.pvdGenerator.makePvd(dif).then((difPvd) => {
            var dea = {'type': 'ema', 'pack': {'N': paraObj.paras.Na, 'pvd': difPvd}};
            return pvdGenerator.pvdGenerator.makePvd(dea).then((deaPvd) => {
                var macd = {'type': 'sub', 'pack': {'pvds': [difPvd, deaPvd], 'idx': 0}};
                return pvdGenerator.pvdGenerator.makePvd(macd).then((macdPvd) => {
                    return new MACDDataPvd(pvd, difPvd, deaPvd, macdPvd, id);
                });
            });
        });
    });
}

module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
