
var utility = require('../../../utility');
var validate = utility.validate;
var object = utility.object;
var pvdGenerator = require('../../../dataPvd/makeDataPvd');

function checkParams(paramObj) {
    if(!(validate.isObj(paramObj) && object.numOfKeys(paramObj) === 2 &&
    validate.isArr(paramObj.pvds) && validate.isNonNegInt(paramObj.idx) && paramObj.idx < paramObj.pvds.length))
        return false;
    var N = paramObj.pvds.length;
    for(var i = 0; i < N; i++) {
        if(!pvdGenerator.checkldp(paramObj.pvds[i]))
            return false;
    }
    return true;
}

function pvdID(paramObj, name) {
    var subID = '';
    paramObj.pvds.forEach((pvd) => {
        subID = subID + '_' + pvdGenerator.pvdID(pvd);
    })
    return name + '_' + paramObj.idx + subID;
}

var pendingPromise = {};
function makePvd(paramObj, id, consFunc) {
    if(!(id in pendingPromise)) {
        var promise = Promise.all(paramObj.pvds.map((pvd) => {
            return pvdGenerator.makePvd(pvd);
        })).then((pvds) => {
            delete pendingPromise[id];
            return new consFunc(pvds, paramObj.idx, id);
        });
        pendingPromise[id] = promise;
    }
    return pendingPromise[id];
}

module.exports = {
    'checkParams': checkParams,
    'pvdID': pvdID,
    'makePvd': makePvd
}
