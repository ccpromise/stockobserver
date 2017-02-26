
var DataCalculatePvd = require('./DataCalculatePvd');

function SubDataPvd(pvd1, pvd2) {
    //return new DataCalculatePvd(pvd1, pvd2, (obj1, obj2) => obj1+obj2);
    DataCalculatePvd.call(this, pvd1, pvd2, (obj1, obj2) => obj1-obj2);
}

SubDataPvd.prototype = Object.create(DataCalculatePvd.prototype);

module.exports = SubDataPvd;
