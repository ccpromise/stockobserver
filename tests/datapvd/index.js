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

    var dataPvd = require('../../src/datapvd2');
    var strategy = require('../../src/strategy');
    var EndDataPvd = dataPvd.EndDataPvd;
    var StdDataPvd = dataPvd.StdDataPvd;
    var MADataPvd = dataPvd.MADataPvd;
    var BollDataPvd = dataPvd.BollDataPvd;
    var AddDataPvd = dataPvd.AddDataPvd;
    var SubDataPvd = dataPvd.SubDataPvd;
    var ConstDataPvd = dataPvd.ConstDataPvd;
    var OffsetDataPvd = dataPvd.OffsetDataPvd;
    var CachedMADataPvd = dataPvd.CachedMADataPvd;
    var CachedBollDataPvd = dataPvd.CachedBollDataPvd;
    var CachedMACDDataPvd = dataPvd.CachedMACDDataPvd;
    var CachedEMADataPvd = dataPvd.CachedEMADataPvd;

    var end = new EndDataPvd(data);

    var ma = new MADataPvd(end, 5);

    var ma2 = new MADataPvd(ma, 5);

    var std = new StdDataPvd(end, 5);

    var boll = new BollDataPvd(end, 5);

    var add = new AddDataPvd(end, ma);

    var constant = new ConstDataPvd('infinity');

    var offset = new OffsetDataPvd(end, -4);

    var cma = new CachedMADataPvd(end, 5);

    var cboll = new CachedBollDataPvd(end, 5);

    var cmacd = new CachedMACDDataPvd(end);

    var cema = new CachedEMADataPvd(end, 12);


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

    assert.equal(cma.get(17241), ma.get(17241));
    assert.equal(cboll.get(17241).toString(), boll.get(17241).toString());

    var price = end.get(17242);
    var yestEma = cema.get(17241);
    var todayEma = cema.get(17242);
    assert.equal(2/13*price+11/13*yestEma, todayEma);

    var MACross = strategy.MACross;
    var x = MACross(end);
    var profit = 0;
    x.forEach(trans => profit += (trans['收益比例'] === undefined ? 0 : trans['收益比例']))
    console.log(x);
    console.log('total profit: ', profit);

    console.log('done!');
    console.log('waiting for cache to clear....');
});
