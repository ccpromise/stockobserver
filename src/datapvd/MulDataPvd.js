
var DataCalculatePvd = require('./DataCalculatePvd');

function MulDataPvd(pvd1, pvd2) {
    DataCalculatePvd.call(this, pvd1, pvd2, (obj1, obj2) => obj1*obj2);
}

MulDataPvd.prototype = Object.create(DataCalculatePvd.prototype);

module.exports = MulDataPvd;
