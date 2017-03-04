
var DataPvd = require('./DataPvd');
var object = require('../../utility').object;

function ConstDataPvd(obj, id) {
    DataPvd.call(this, id);
    this.minTs = -Infinity;
    this.maxTs = Infinity;
    this.obj = obj;
}

ConstDataPvd.prototype = Object.create(DataPvd.prototype);

ConstDataPvd.prototype.hasDef = function(ts) {
    return true;
}

ConstDataPvd.prototype.get = function(ts) {
    return this.obj;
}

ConstDataPvd.prototype.forwardDateTs = function(ts, n) {
    return ts + n;
}

ConstDataPvd.prototype.backwardDateTs = function(ts, n) {
    return ts - n;
}

// {'obj': }
function checkParas(paraObj) {
    return 'obj' in paraObj && object.numOfKeys(paraObj) === 1;
}

function pvdID(paraObj) {
    return 'const' + '_' + JSON.stringify(paraObj['obj']);
}

function makePvd(paraObj, id) {
    return Promise.resolve(new ConstDataPvd(paraObj['obj'], id));
}


module.exports = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
}
