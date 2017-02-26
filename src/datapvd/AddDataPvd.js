
var DataCalculatePvd = require('./DataCalculatePvd');

function AddDataPvd(pvd1, pvd2) {
    DataCalculatePvd.call(this, pvd1, pvd2, (obj1, obj2) => obj1+obj2);
}

AddDataPvd.prototype = Object.create(DataCalculatePvd.prototype);

module.exports = AddDataPvd;
