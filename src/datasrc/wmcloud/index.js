var getMktEquad = require('./getMktEquad').getMktEquad;
var utility = require('../../utility');
var time = utility.time;
var clone = utility.clone;
var queryPattern = {
    field: '',
    beginDate: '',
    endDate: '',
    secID: '',
    ticker: '',
    tradeDate: ''
};
var property = ['o', 'e', 'h', 'l', 'x', 'v'];

exports.getHistoryData = function(secID) {
    var query = clone(queryPattern);
    var fields = ['tradeDate', 'openPrice', 'closePrice', 'highestPrice', 'lowestPrice', 'turnoverRate', 'turnoverVol'];
    query.secID = secID;
    query.field = fields.join(',');
    return getMktEquad(query).then((obj) => {
        if(obj.retCode != 1) return obj.retMsg;
        return obj.data.reduce((pre, cur) => {
            var date = time.formatDate(cur['tradeDate'], 'YYYYMMDD');
            pre[date] = {};
            for(var i = 0; i < 6; i++)
                pre[date][property[i]] = cur[fields[i+1]];
            return pre;
        }, {});
    });
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
