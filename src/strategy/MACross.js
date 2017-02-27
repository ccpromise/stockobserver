
var CachedMADataPvd = require('../datapvd2/CachedMADataPvd');
var SubDataPvd = require('../datapvd2/SubDataPvd');

function MACross(endDatapvd) {
    var ma10 = new CachedMADataPvd(endDatapvd, 10);
    var ma60 = new CachedMADataPvd(endDatapvd, 60);
    var diff = new SubDataPvd(ma10, ma60);
    var transactions = [];

    for(var yest = diff.get(diff.minTs), ts = diff.forwardDateTs(diff.minTs, 1); diff.hasDef(ts); ts = diff.forwardDateTs(ts, 1)){
        var today = diff.get(ts);

        if(yest < 0 && today > 0) {
            transactions.push({
                '买入时间': ts,
                '买入价格': endDatapvd.get(ts)
            });
        }
        else if(yest > 0 && today < 0 && transactions.length != 0) {
            var buyPrice = transactions[transactions.length-1]['买入价格'];
            var sellPrice = endDatapvd.get(ts);
            var profit = (sellPrice - buyPrice) / buyPrice;
            transactions.push({
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
