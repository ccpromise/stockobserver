
var makeDataPvd = require('../../src/node_modules/dataPvd');

var macd = makeDataPvd({ type: 'macd', pack: { Nl: 12, Ns: 26, Na: 9, pvd: { type: 'end', pack: '000001.xshe' } } });
macd.then((pvd) => {
    var ts = pvd._dea.minTs;
    console.log(pvd._dea.minTs);
    console.log(pvd._dea.maxTs);
    while(pvd._dea.hasDef(ts)) {
        console.log(ts, pvd._dea.get(ts));
        ts = pvd._dea.forwardDateTs(ts, 1);
    }
    var ts = pvd.minTs;
    console.log(pvd.minTs);
    console.log(pvd.maxTs);
    while(pvd.hasDef(ts)) {
        console.log(ts, pvd.get(ts));
        ts = pvd.forwardDateTs(ts, 1);
    }
})

// var ldp1 = {'type': 'end', 'pack': '000001.xshe'};
// var ldp2 = {'type': 'ma', 'pack': {'pvd': ldp1, 'N': 1}};
// var ldp3 = {'type': 'ma', 'pack': {'pvd': ldp2, 'N': 1}};
//
// makeDataPvd(ldp3).then(() => {
//     console.log('here');
//     console.log(cache.toString());
//     // now ldp2 and ldp3 in cache.
//     // call makeDataPvd(lpd3) again to make sure ldp2 is the least recently used.
//     return makeDataPvd(ldp3).then(() => {
//         var p = Promise.resolve();
//         var i = 3;
//         var max = 50;
//         // add other 48 dp into cache. the maximum capacity of cache is 50.
//         return async.while(() => {
//             return i <= max;
//         }, () => {
//             var cpy = JSON.parse(JSON.stringify(ldp2));
//             cpy.pack.N = i++;
//             return makeDataPvd(cpy);
//         })
//     }).then(() => {
//         // now cache is full. we try to add one more item into cache.
//         // the least recently used ldp2 will be removed. As ldp3 refers to ldp2, ldp3 will be removed too.
//         console.log(cache.toString());
//         var cpy = JSON.parse(JSON.stringify(ldp2));
//         cpy.pack.N = 51;
//         return makeDataPvd(cpy);
//     }).then(() => {
//         console.log(cache.toString());
//     })
// })
//


/*
var ldp1 = {'type': 'end', 'pack': '000001.xshe'};
var ldp2 = {'type': 'ma', 'pack': {'pvd': ldp1, 'N': 5}};
makeDataPvd(ldp1).then((end) => {
    var ldp3 = {'type': 'ma', 'pack': {'pvd': end, 'N': 5}};
    console.log(end.get(17240));
    return makeDataPvd(ldp2).then((ma) => {
        console.log(ma.get(17240));
        var gt = {'type': 'gt', 'pack': {'pvds': [ldp2, ldp1], 'idx': 0}};
        return makeDataPvd(gt).then((gt) => {
            console.log(gt.get(17240));
        })
        return makeDataPvd(ldp3); });
}).catch((err) => console.log('find error: ', err));

var ldp4 = {'type': 'ema', 'pack': {'pvd': ldp2, 'N': 11}};
makeDataPvd(ldp4).then((ema) => {
    makeDataPvd(ldp4);
}).catch((err) => console.log('find error: ', err));;
var ldp5 = {'type': 'boll', 'pack': {'pvd': ldp1, 'N': 5}};
makeDataPvd(ldp5).then((boll) => {
    //console.log('boll done');
}).catch((err) => console.log('find error: ', err));;
var ldp6 = {'type': 'macd', 'pack': {'pvd': ldp1, 'Nl': 8, 'Ns': 12, 'Na': 9}};
makeDataPvd(ldp6).then((macd) => {
    //console.log('macd done');
}).catch((err) => console.log('find error: ', err));
var ldp7 = {'type': 'add', 'pack': {'pvds': [ldp1, ldp2], 'idx': 0}};
makeDataPvd(ldp7).then((add) => {
    console.log(add.get(17240));
    makeDataPvd(ldp7);
}).catch((err) => console.log('find error: ', err));
var ldp8 = {'type': 'offset', 'pack': {'pvd': ldp1, 'N': -2}};
makeDataPvd(ldp8).then((offset) => {
    //console.log('offset done');
}).catch((err) => console.log('find error: ', err));


var ldp1 = {'type': 'end', 'pack': '000001.xshe'};
var ldp2 = {'type': 'ma', 'pack': {'pvd': ldp1, 'N': 5}};
var a = makeDataPvd(ldp2);
var b = makeDataPvd(ldp2);

//Promise.all([a,b]).then((obj) => console.log(obj[0] === obj[1]));


makeDataPvd(ldp1).then((end) => {
    var ldp3 = {'type': 'ma', 'pack': {'pvd': end, 'N': 5}};
    return makeDataPvd(ldp3).then(() => makeDataPvd(ldp3));
});
*/
