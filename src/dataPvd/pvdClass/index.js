
list = ['statDataPvd', 'combinedDataPvd', 'stockDataPvd', 'basicDataPvd'];

var allDataPvd = list.map((pvd) => require('./'+pvd));
allDataPvd.forEach((pack) => {
    var pvds = Object.keys(pack);
    pvds.forEach((pvd) => {
        exports[pvd] = pack[pvd];
    })
});
