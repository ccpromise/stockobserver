var getMktEquad = require('./getMktEquad').getMktEquad;
var utility = require('../../utility');
var time = utility.time;
var clone = utility.object.clone;
var queryPattern = {
    field: '',
    beginDate: '',
    endDate: '',
    secID: '',
    ticker: '',
    tradeDate: ''
};
var property = ['o', 'e', 'h', 'l', 'x', 'v'];

exports.getHistoryData = function(secID, beginDate, endDate) {
    try {
        beginDate = beginDate || '19900101';
        endDate = endDate || time.today();
        var query = clone(queryPattern);
        var fields = ['tradeDate', 'openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol'];
        query.secID = secID;
        query.field = fields.join(',');
        query.beginDate = beginDate;
        query.endDate = endDate;
        return getMktEquad(query).then((obj) => {
            if(obj.retCode != 1) throw new Error(obj.retMsg);
            var minDay = time.today();
            var maxDay = time.getDateTs('19900101');
            var tradeData = obj.data.reduce((pre, cur) => {
                var date = time.formatDate(cur['tradeDate'], 'YYYYMMDD');
                minDay = time.isBefore(minDay, date) ? minDay : date;
                maxDay = time.isAfter(maxDay, date) ? maxDay : date;
                pre[date] = {};
                for(var i = 0; i < 6; i++)
                    pre[date][property[i]] = cur[fields[i+1]];
                return pre;
            }, {});
            return {
                data: tradeData,
                minDay: minDay,
                maxDay: maxDay
            };
        });
    }
    catch(err) {
        return Promise.reject(err);
    }
};

exports.getTradeDateData = function(tradeDate) {
    var query = clone(queryPattern);
    var fields = ['secID', 'openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol'];
    query.tradeDate = tradeDate;
    query.field = fields.join(',');
    return getMktEquad(query).then((obj) => {
        if(obj.retCode != 1) return obj.retMsg;
        return obj.data.reduce((pre, cur) => {
            pre[cur['secID']] = {};
            for(var i = 0; i < 6; i++)
                pre[cur['secID']][property[i]] = cur[fields[i+1]];
            return pre;
        }, {});
    });
};
