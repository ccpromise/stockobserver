
var dataPvd = require('../datapvd');
var MADataPvd = dataPvd.MADataPvd;
var SubDataPvd = dataPvd.SubDataPvd;

function MACross(endDatapvd) {
    var ma10 = new MADataPvd(endDatapvd, 10);
    var ma60 = new MADataPvd(endDatapvd, 60);
    var diff = new SubDataPvd([ma10, ma60], 1);
    var transactions = [];

    for(var yest = diff.get(diff.minTs), ts = diff.forwardDateTs(diff.minTs, 1); diff.hasDef(ts); ts = diff.forwardDateTs(ts, 1)){
        var today = diff.get(ts);

        if(yest < 0 && today > 0) {
            transactions.push({
                '买入时间': ts,
                '买入价格': endDatapvd.get(ts),
                '卖出时间': "",
                '卖出价格': "",
                '收益比例': ""
            });
        }
        else if(yest > 0 && today < 0 && transactions.length != 0) {
            var buyPrice = transactions[transactions.length-1]['买入价格'];
            var sellPrice = endDatapvd.get(ts);
            var profit = (sellPrice - buyPrice) / buyPrice;
            transactions.push({
                '买入时间': "",
                '买入价格': "",
                '卖出时间': ts,
                '卖出价格': endDatapvd.get(ts),
                '收益比例': profit
            });
        }
        yest = today;
    }
    return transactions;
}

module.exports = MACross;
