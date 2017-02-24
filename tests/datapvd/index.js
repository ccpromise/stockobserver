var MADataPvd = require('../../src/datapvd').MADataPvd;
var fs = require('fs');

fs.readFile('../datasrc/wmcloud/data.txt', (err, data) => {
    data = JSON.parse(data);
    var pvd = new MADataPvd(data, 5);
    console.log(pvd.minTs);
    console.log(pvd.maxTs);
    console.log(pvd.hasDef(pvd.minTs-1));
    console.log(pvd.get(pvd.maxTs-1));
})
