
var CombinedDataPvd = require('./CombinedDataPvd');
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var utility = require('../../../utility');
var validate = utility.validate;
var object = utility.object;

function DivDataPvd(pvds, domainIdx, id) {
    CombinedDataPvd.call(this, pvds, domainIdx, id);
}

DivDataPvd.prototype = Object.create(CombinedDataPvd.prototype);

DivDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    return this.pvds.slice(1).reduce((pre, cur) => { return pre / cur.get(ts); }, this.pvds[0].get(ts));
}

function checkParams(paraObj) {
    if(!(validate.isObj(paraObj) && object.numOfKeys(paraObj) === 2 &&
    validate.isArr(paraObj.pvds) && validate.isNonNegInt(paraObj.idx) && paraObj.idx < paraObj.pvds.length))
        return false;
    var N = paraObj.pvds.length;
    for(var i = 0; i < N; i++) {
        if(!pvdGenerator.checkldp(paraObj.pvds[i]))
            return false;
    }
    return true;
}

function pvdID(paraObj) {
    var subID = '';
    paraObj.pvds.forEach((pvd) => {
        subID = subID + '_' + pvdGenerator.pvdID(pvd);
    })
    return 'div' + '_' + paraObj.idx + subID;
}

function makePvd(paraObj, id) {
    return Promise.all(paraObj.pvds.map((pvd) => {
        return pvdGenerator.makePvd(pvd);
    })).then((pvds) => {
        return new DivDataPvd(pvds, paraObj.idx, id);
    });
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
}
