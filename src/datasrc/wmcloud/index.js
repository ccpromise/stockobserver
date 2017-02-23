var getMktEquad = require('./getMktEquad').getMktEquad;
var time = require('../../utility').time;
var parseObjArr = require('../../utility').parse.parseObjArr;
var queryPattern = {
    field: '',
    beginDate: '',
    endDate: '',
    secID: '',
    ticker: '',
    tradeDate: ''
};

exports.getHistoryData = function(secID) {
    var query = queryPattern;
    var fields = ['tradeDate', 'openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol'];
    query.secID = secID;
    query.field = fields.join('%2C');
    return getMktEquad(query).then((obj) => {
        return  parseObjArr(obj.data, fields, ['s', 'e', 'h', 'l', 'x', 'v'], (x) => { return time.formatDate(x, 'YYYYMMDD')});
        // return: {formated_tradeDate: {s: , e: , h: , l: , x: , v: }}
    });
};//('000001.XSHE').then((data) => { console.log('done!'); }).catch((err) => { console.log(err); });

exports.getTradeDateData = function(tradeDate) {
    var query = queryPattern;
    var fields = ['secID', 'openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol'];
    query.tradeDate = tradeDate;
    query.field = fields.join('%2C');
    return getMktEquad(query).then((obj) => {
        return parseObjArr(obj.data, fields, ['s', 'e', 'h', 'l', 'x', 'v']);
        // return: {secID: {s:,e:,h:,l:,x:,v}};
    });
};//('20150518').then((data) => { console.log('done!'); }).catch((err) => { console.log(err);});


exports.getClosePrice = function(secID) {
    var query = queryPattern;
    var fields = ['tradeDate', 'closePrice'];
    query.secID = secID;
    query.field = fields.join('%2C');
    return getMktEquad(query).then((obj) => {
        return parseObjArr(obj.data, fields, ['e'], (x) => { return time.getDateTs(x); });
        // return: { dateTs: {'e':}}
    })
};//('000001.XSHE').then(data => {console.log(data);}).catch(err => console.log(err));
