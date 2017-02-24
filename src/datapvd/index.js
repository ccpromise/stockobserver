
var time = require('../utility').time;

exports.MADataPvd = MADataPvd;

function MADataPvd(stock, N) {
    // stock: {
    //   ts: {e: },
    // }
    // when n is positive, get the next n days from ts.
    // when n is negative, get the previous -n days from ts.
    var getNearTs = function(ts, n) {
        var inc = n > 0 ? 1 : -1;
        while(ts > minTs && ts < maxTs && n != 0) {
            ts += inc;
            while(!(ts in stock)) ts += inc;
            n -= inc;
        }
        return n == 0 ? ts : -1;
    }

    var minTs = time.getDateTs(time.now());
    var maxTs = 0;
    for(ts in stock) {
        minTs = Math.min(minTs, ts);
        maxTs = Math.max(maxTs, ts);
    }

    this.minTs = getNearTs(minTs, N-1);
    this.maxTs = minTs == -1 ? -1 : maxTs;
    this.hasDef = function(ts) {
        return ts in stock && ts >= this.minTs && ts <= this.maxTs;
    }
    this.get = function(ts) {
        if(!this.hasDef(ts)) return Promise.reject('invalid ts');
        var sum = 0;
        var n = N;
        while(n > 0) {
            sum += stock[ts]['e'];
            ts = getNearTs(ts, -1);
            n--;
        }
        return Promise.resolve(sum/N);
    }
}
