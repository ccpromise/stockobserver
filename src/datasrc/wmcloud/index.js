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

exports.getHistoryDataofOne = function(secID) {
    var query = queryPattern;
    var fields = ['openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol', 'tradeDate'];
    query.secID = secID;
    query.field = fields.join(',');
    return getMktEqud(query).then((obj) => {
        var res = {};
        obj.data.forEach((item) => {
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
};//('000001.XSHE').then((data) => { console.log(data); }).catch((err) => { console.log(err); });

exports.getTradeDateDataofAll = function(tradeDate) {
    var query = queryPattern;
    var fields = ['openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol', 'secID'];
    query.tradeDate = tradeDate;
    query.field = fields.join(',');
    return getMktEqud(query).then((obj) => {
        var res = {};
        obj.data.forEach((item) => {
            res[item.secID] = {
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
};//('20150518').then((data) => { console.log(data); }).catch((err) => { console.log(err);});
