
var CombinedDataPvd = require('./CombinedDataPvd');
var pvdGenerator = require('../../dataPvdGenerator');
var utility = require('../../utility');
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

function checkParas(paraObj) {
    if(!(validate.isObj(paraObj) && object.numOfKeys(paraObj) === 2 &&
    validate.isArr(paraObj.pvds) && validate.isNonNegNum(paraObj.idx) && paraObj.idx < paraObj.pvds.length))
        return false;
    var N = paraObj.pvds.length;
    for(var i = 0; i < N; i++) {
        if(!validate.isDataPvd(paraObj.pvds[i]) && !pvdGenerator.pvdGenerator.checkParas(paraObj.pvds[i]))
            return false;
    }
    return true;
}

function pvdID(paraObj) {
    var subID = '';
    paraObj.pvds.forEach((pvd) => {
        subID = subID + '_' + (validate.isDataPvd(pvd) ? pvd.id : pvdGenerator.pvdGenerator.pvdID(pvd));
    })
    return 'div' + '_' + paraObj.idx + subID;
}

function makePvd(paraObj, id) {
    return Promise.all(paraObj.pvds.map((pvd) => {
        return validate.isDataPvd(pvd) ? Promise.resolve(pvd) : pvdGenerator.pvdGenerator.makePvd(pvd);
    })).then((pvds) => {
        return new DivDataPvd(pvds, paraObj.idx, id);
    });
}

module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
