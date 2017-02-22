var getMktEqud = require('./getMktEquad').getMktEquad;
var time = require('../../utility').time;
var queryPattern = {
    field: '',
    beginDate: '',
    endDate: '',
    secID: '',
    ticker: '',
    tradeDate: ''
}

exports.getHistoryData = function(secID) {
    var query = queryPattern;
    query.secID = secID;
    return getMktEqud(query).then((obj) => {
        var data = obj.data;
        var res = {};
        console.log(obj);
        data.forEach((item) => {
            var date = time.convertToYYYYMMDD(item.tradeDate);
            res[date] = {
                's': item.openPrice,
                'e': item.closePrice,
                'h': item.highestPrice,
                'l': item.lowestPrice,
                'x': item.turnoverRate,
                'v': item.turnoverVol
            }
        });
        return res;
    });
};//('000001.XSHE').then((data) => {console.log(data);}).catch((err) => { console.log(err); });

exports.getTradeDateDataofAll = function(tradeDate) {
    var query = queryPattern;
    query.tradeDate = tradeDate;
    return getMktEqud(query).then((obj) => {
        var data = obj.data;
        console.log(obj);
        var res = {};
        data.forEach((item) => {
            var secID = item.secID;
            data[secID] = {
                's': item.openPrice,
                'e': item.closePrice,
                'h': item.highestPrice,
                'l': item.lowestPrice,
                'x': item.turnoverRate,
                'v': item.turnoverVol
            }
        });
        return data;
    });
};//('20150517').then((data) => { console.log(data); }).catch((err) => { console.log(err);});
