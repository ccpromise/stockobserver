
var DataCalculatePvd = require('./DataCalculatePvd');

function DivDataPvd(pvd1, pvd2) {
    DataCalculatePvd.call(this, pvd1, pvd2, (obj1, obj2) => obj1/obj2);
}

DivDataPvd.prototype = Object.create(DataCalculatePvd.prototype);

module.exports = DivDataPvd;
