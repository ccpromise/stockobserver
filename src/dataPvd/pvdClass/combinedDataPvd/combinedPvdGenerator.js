
var utility = require('../../../utility');
var validate = utility.validate;
var object = utility.object;
var pvdGenerator = require('../../../dataPvd/makeDataPvd');
var CombinedDataPvd = require('./CombinedDataPvd');

// {pvds: idx: }
function checkParams(paramObj, minPvdN, maxPvdN) {
    minPvdN = minPvdN || 1;
    maxPvdN = maxPvdN || Infinity;
    var pvdN = paramObj.pvds.length;
    if(!(validate.isObj(paramObj) && object.numOfKeys(paramObj) === 2 &&
    validate.isArr(paramObj.pvds) && pvdN >= minPvdN && pvdN <= maxPvdN
    && validate.isNonNegInt(paramObj.idx) && paramObj.idx < pvdN))
        return false;
    var N = paramObj.pvds.length;
    for(var i = 0; i < N; i++) {
        if(!pvdGenerator.checkldp(paramObj.pvds[i]))
            return false;
    }
    return true;
}

function pvdID(paramObj, name) {
    return name + '_' + paramObj.idx + paramObj.pvds.map(pvd => pvdGenerator.pvdID(pvd)).join('_');
}

function makePvd(paramObj, id, getOperator) {
    return Promise.all(paramObj.pvds.map((pvd) => {
        return pvdGenerator.makePvd(pvd);
    })).then((pvds) => {
        return new CombinedDataPvd(pvds, paramObj.idx, id, getOperator);
    });
}

module.exports = function(name, getOperator, minPvdN, maxPvdN) {
    return {
        'checkParams': (paramObj) => checkParams(paramObj, minPvdN, maxPvdN),
        'pvdID': (paramObj) => pvdID(paramObj, name),
        'makePvd': (paramObj, id) => makePvd(paramObj, id, getOperator)
    }
}
