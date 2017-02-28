
var utility = require('../utility');
var time = utility.time;
var object = utility.object;

function cleanData(stockData) {
    var data = {};
    Object.keys(stockData.data).forEach((day) => {
        data[time.getDateTs(day)] = stockData.data[day];
    });

    var minTs = time.getDateTs(stockData.minDay);
    var maxTs = time.getDateTs(stockData.maxDay);
    var sortedTs = [];
    for(var ts = minTs; ts <= maxTs; ts ++) {
        if(ts in data) {
            sortedTs.push(ts);
        }
    }

    var totalDays = sortedTs.length;
    var wrongTs = [];
    for(var i = 0; i < totalDays; i++) {
        ts = sortedTs[i];
        if(data[ts]['x'] > 1 || data[ts]['x'] === 0 || data[ts]['v'] === 0 || data[ts]['l'] > data[ts]['h']) {
            wrongTs.push(ts);
        }
        if(i > 0) {
            var preTs = sortedTs[i-1];
            if(object.contentEqual(data[preTs], data[ts])) {
                wrongTs.push(ts);
                wrongTs.push(preTs);
            }
        }
    }

    wrongTs.forEach((ts) => {
        delete data[ts];
    });
    minTs = Infinity;
    maxTs = -Infinity;
    for(ts in data) {
        minTs = Math.min(minTs, ts);
        maxTs = Math.max(maxTs, ts);
    }
    if(minTs > maxTs) {
        minTs = -1;
        maxTs = -1;
    }
    stockData.data = data;
    stockData.minTs = minTs;
    stockData.maxTs = maxTs;
    delete stockData[minDay];
    delete stockData[maxDay];
}

module.exports = cleanData;
