
var makeDataPvd = require('../../src/dataPvdGenerator').makeDataPvd;
var assert = require('assert');
/*
makeDataPvd('end', {'secID': '000001.XSHE'}).then((x) => {
    return makeDataPvd('end', {'secID': '000001.XSHE'}).then((y) => {
        assert.equal(x.get(17252), y.get(17252));
        assert.equal(x.minTs, y.minTs);
        assert.equal(x.maxTs, y.maxTs);
    }).then(() => { return makeDataPvd('ma', {'pvd': x, 'N': 5}); }).then(() => {
        return makeDataPvd('ma', {'pvd': x, 'N': 5});
    }).then(() => { return makeDataPvd('ma', {'pvd': x, 'N': 10}); }).then(() => {
        return makeDataPvd('macd', {'pvd': x, 'paras': {'Nl': 8, 'Ns': 12, 'Na': 9}});
    }).then(() => { return makeDataPvd('ema', {'pvd': x, 'N': 11}); }).then(() => {
        return makeDataPvd('boll', {'pvd': x, 'N': 11});
    }).then(() => { return makeDataPvd('add', {'pvds': [x, x], 'idx': 0}); }).then(() => {
        return makeDataPvd('const', {'obj': 'hello'});
    }).then(() => { return makeDataPvd('offset', {'pvd': x, 'N': -2}); });
}).catch(err => console.log(err));
*/
var ldp1 = {'type': 'end', 'pack': {'secID': '000001.XSHE'}};
var ldp2 = {'type': 'ma', 'pack': {'pvd': ldp1, 'N': 5}};
makeDataPvd(ldp1).then((end) => {
    var ldp3 = {'type': 'ma', 'pack': {'pvd': end, 'N': 5}};
    makeDataPvd(ldp2).then(() => makeDataPvd(ldp3));
})

var ldp4 = {'type': 'ema', 'pack': {'pvd': ldp2, 'N': 11}};
makeDataPvd(ldp4).then((ema) => {
    makeDataPvd(ldp4);
});
var ldp5 = {'type': 'boll', 'pack': {'pvd': ldp1, 'N': 5}};
makeDataPvd(ldp5).then((boll) => {
    //console.log('boll done');
});
var ldp6 = {'type': 'macd', 'pack': {'pvd': ldp1, 'paras': {'Nl': 8, 'Ns': 12, 'Na': 9}}};
makeDataPvd(ldp6).then((macd) => {
    //console.log('macd done');
})
var ldp7 = {'type': 'add', 'pack': {'pvds': [ldp1, ldp2], 'idx': 0}};
makeDataPvd(ldp7).then((add) => {
    makeDataPvd(ldp7);
})
var ldp8 = {'type': 'offset', 'pack': {'pvd': ldp1, 'N': -2}};
makeDataPvd(ldp8).then((offset) => {
    //console.log('offset done');
})
