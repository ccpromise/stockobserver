var fs = require('fs');
var assert = require('assert');
var statistics = require('../../src/utility').statistics;

fs.readFile('../datasrc/wmcloud/data.txt', (err, data) => {
    data = JSON.parse(data);
    var stock = {};
    stock['data'] = data;
    stock['minTs'] = 7792;
    stock['maxTs'] = 17249;

    console.log('test DataPvd version....');

    var dataPvd = require('../../src/datapvd');
    var strategy = require('../../src/strategy');
    var EndDataPvd = dataPvd.EndDataPvd;
    var StdDataPvd = dataPvd.StdDataPvd;
    var MADataPvd = dataPvd.MADataPvd;
    var BollDataPvd = dataPvd.BollDataPvd;
    var AddDataPvd = dataPvd.AddDataPvd;
    var SubDataPvd = dataPvd.SubDataPvd;
    var ConstDataPvd = dataPvd.ConstDataPvd;
    var OffsetDataPvd = dataPvd.OffsetDataPvd;
    var MADataPvd = dataPvd.MADataPvd;
    var BollDataPvd = dataPvd.BollDataPvd;
    var MACDDataPvd = dataPvd.MACDDataPvd;
    var EMADataPvd = dataPvd.EMADataPvd;

    var end = new EndDataPvd(stock);

    var ma = new MADataPvd(end, 5);

    var ma2 = new MADataPvd(ma, 5);

    var std = new StdDataPvd(end, 5);

    var boll = new BollDataPvd(end, 5);

    var x = [end.get(17248), end.get(17247), end.get(17246), end.get(17245), end.get(17242)];

    var add = new AddDataPvd([end, ma], 1);

    var constant = new ConstDataPvd('infinity');

    var offset = new OffsetDataPvd(end, -4);

    var cma = new MADataPvd(end, 5);

    var cboll = new BollDataPvd(end, 5);

    var cmacd = new MACDDataPvd(end, [12, 26, 9]);

    var cema = new EMADataPvd(end, 12);

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
    x.forEach(trans => profit += (trans['收益比例'] === "" ? 0 : trans['收益比例']))
    console.log('total profit: ', profit);

    var csv = require('../../src/utility').file.writeToCSV;
    csv('./data.csv', x);
    console.log('done!');
});
