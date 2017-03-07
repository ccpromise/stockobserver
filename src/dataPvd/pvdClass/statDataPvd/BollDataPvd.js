
var StatDataPvd = require('./StatDataPvd');
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
var statistics = utility.statistics;
var validate = utility.validate;
var object = utility.object;
var k = require('../../../config').bollingerK;

function BollDataPvd(pvd, N, id) {
    StatDataPvd.call(this, pvd, N, id);
}

BollDataPvd.prototype = Object.create(StatDataPvd.prototype);

BollDataPvd.prototype._calculate = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n--;
    }
    var avg = statistics.mean(data);
    var std = statistics.std(data);
    return {
        'MA': avg,
        'UP': avg + k * std,
        'DW': avg - k * std
    };
}

function checkParams(paraObj) {
    if(!validate.isObj(paraObj) || object.numOfKeys(paraObj) !== 2 || !validate.isPosInt(paraObj.N)) return false;
    return pvdGenerator.checkldp(paraObj.pvd);
}

function pvdID(paraObj) {
    return 'boll' + '_' + paraObj.N + '_' + pvdGenerator.pvdID(paraObj.pvd);
}

function makePvd(paraObj, id) {
    return pvdGenerator.makePvd(paraObj.pvd).then((pvd) => {
        return new BollDataPvd(pvd, paraObj.N, id);
    })
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
}
