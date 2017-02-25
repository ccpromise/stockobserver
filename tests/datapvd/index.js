var fs = require('fs');

fs.readFile('../datasrc/wmcloud/data.txt', (err, data) => {
    data = JSON.parse(data);
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
    console.log(hist.minTs);
    console.log(hist.maxTs);
    console.log(hist.get(17248));

    var ma = new MADataPvd(data, 5);
    console.log(ma.get(17248));

    var std = new StdDataPvd(data, 5);
    console.log(std.get(17248));

    var boll = new BollDataPvd(data, 5);
    console.log(boll.get(17248));

    console.log('test DataPvd version....');

    dataPvd = require('../../src/datapvd');
    var DataPvd = dataPvd.DataPvd;
    var HistoryDataPvd = dataPvd.HistoryDataPvd;
    StdDataPvd = dataPvd.StdDataPvd;
    MADataPvd = dataPvd.MADataPvd;
    BollDataPvd = dataPvd.BollDataPvd;

    end = new DataPvd(data, (obj) => { return obj['e']; });
    console.log(end.minTs);
    console.log(end.maxTs);
    console.log(end.get(17248));
    console.log(end.get(17247));
    console.log(end.get(17246));
    console.log(end.get(17245));
    console.log(end.get(17242));

    hist = new HistoryDataPvd(end, 5);
    console.log(hist.minTs);
    console.log(hist.maxTs);
    console.log(hist.get(17248));

    var ma = new MADataPvd(end, 5);
    console.log(ma.get(17248));

    var std = new StdDataPvd(end, 5);
    console.log(std.get(17248));

    var boll = new BollDataPvd(end, 5);
    console.log(boll.get(17248));

});
