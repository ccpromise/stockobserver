var fs = require('fs');
var assert = require('assert');
var statistics = require('../../src/utility').statistics;

fs.readFile('../datasrc/wmcloud/data.txt', (err, data) => {
    data = JSON.parse(data);
    /*
    console.log('test EndDataPvd version.....');

    var dataPvd = require('../../src/datapvd/__EndDataVersion.js');
    var EndDataPvd = dataPvd.EndDataPvd;
    var HistoryEndDataPvd = dataPvd.HistoryEndDataPvd;
    var MADataPvd = dataPvd.MADataPvd;
    var StdDataPvd = dataPvd.StdDataPvd;
    var BollDataPvd = dataPvd.BollDataPvd;

    var end = new EndDataPvd(data);
    console.log(end.minTs);
    console.log(end.maxTs);
    console.log(end.get(17248));
    console.log(end.get(17247));
    console.log(end.get(17246));
    console.log(end.get(17245));
    console.log(end.get(17242));

    var hist = new HistoryEndDataPvd(data, 5);
    console.log(ma.minTs);
    console.log(ma.maxTs);
    console.log(ma.get(17248));

    var ma = new MADataPvd(data, 5);
    console.log(ma.get(17248));

    var std = new StdDataPvd(data, 5);
    console.log(std.get(17248));

    var boll = new BollDataPvd(data, 5);
    console.log(boll.get(17248));
*/
    console.log('test DataPvd version....');

    dataPvd = require('../../src/datapvd');
    var EndDataPvd = dataPvd.EndDataPvd;
    var HistoryDataPvd = dataPvd.HistoryDataPvd;
    var StdDataPvd = dataPvd.StdDataPvd;
    var MADataPvd = dataPvd.MADataPvd;
    var BollDataPvd = dataPvd.BollDataPvd;
    var AddDataPvd = dataPvd.AddDataPvd;
    var SubDataPvd = dataPvd.SubDataPvd;
    var ConstDataPvd = dataPvd.ConstDataPvd;
    var OffsetDataPvd = dataPvd.OffsetDataPvd;

    var end = new EndDataPvd(data);

    var ma = new MADataPvd(end, 5);

    var ma2 = new MADataPvd(ma, 5);

    var std = new StdDataPvd(end, 5);

    var boll = new BollDataPvd(end, 5);

    var add = new AddDataPvd(end, ma);

    var constant = new ConstDataPvd('infinity');

    var offset = new OffsetDataPvd(end, -4);


    var x = [end.get(17248), end.get(17247), end.get(17246), end.get(17245), end.get(17242)];
    var y = [ma.get(17248), ma.get(17247), ma.get(17246), ma.get(17245), ma.get(17242)];
    var mean1 = statistics.mean(x);
    var mean2 = statistics.mean(y);
    assert.equal(mean1, ma.get(17248));
    assert.equal(mean2, ma2.get(17248));

    assert.equal(statistics.std(x), std.get(17248));

    var data = boll.get(17248);
    assert.equal(data['MA'], ma.get(17248));
    assert.equal(data['UP'], ma.get(17248)+2*std.get(17248));

    assert.equal(end.get(17248)+ma.get(17248), add.get(17248));
    assert.equal(constant.get(1323432), 'infinity');
    assert.equal(offset.get(17248), end.get(17242));


    console.log('done!');
});
