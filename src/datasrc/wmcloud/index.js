var getMktEquad = require('./getMktEquad').getMktEquad;
var time = require('../../utility').time;
var queryPattern = {
    field: '',
    beginDate: '',
    endDate: '',
    secID: '',
    ticker: '',
    tradeDate: ''
}

// return: { key: {k1:v1, k2:v2}}
// fields[0]: key
// keys: [k1, k2]
// fileds[1:]: [v1, v2]
function parseObjArr(objArr, fields, keys, func) {
    var res = {};
    objArr.forEach((obj) => {
        var newObj = {};
        var len = keys.length;
        for(var i = 0; i < len; i++) {
            newObj[keys[i]] = obj[fields[i+1]];
        }
        func = func || (x => x);
        res[func(obj[fields[0]])] = newObj;
    });
    return res;
}

exports.getHistoryDataofOne = function(secID) {
    var query = queryPattern;
    var fields = ['tradeDate', 'openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol'];
    query.secID = secID;
    query.field = fields.join('%2C');
    return getMktEquad(query).then((obj) => {
        return  parseObjArr(obj.data, fields, ['s', 'e', 'h', 'l', 'x', 'v'], (x) => { return time.formatDate(x, 'YYYYMMDD')});
        // return {formated_tradeDate: {s: , e: , h: , l: , x: , v: }}
    });
};//('00001.XSHE').then((data) => { console.log('done!'); }).catch((err) => { console.log(err); });

exports.getTradeDateDataofAll = function(tradeDate) {
    var query = queryPattern;
    var fields = ['secID', 'openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol'];
    query.tradeDate = tradeDate;
    query.field = fields.join('%2C');
    return getMktEquad(query).then((obj) => {
        return parseObjArr(obj.data, fields, ['s', 'e', 'h', 'l', 'x', 'v']);
        // return {secID: {s:,e:,h:,l:,x:,v}};
    });
};//('20150518').then((data) => { console.log('done!'); }).catch((err) => { console.log(err);});


exports.getClosePriceofOne = function(secID) {
    var query = queryPattern;
    var fields = ['tradeDate', 'closePrice'];
    query.secID = secID;
    query.field = fields.join('%2C');
    return getMktEquad(query).then((obj) => {
        return parseObjArr(obj.data, fields, ['e'], (x) => { return time.getDateTs(x); });
        // return { dateTs: {'e':}}
    })
};//('000001.XSHE').then(data => {console.log(data);}).catch(err => console.log(err));
