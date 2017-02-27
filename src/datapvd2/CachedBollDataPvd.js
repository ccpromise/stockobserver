
var CachedStatDataPvd = require('./CachedStatDataPvd');
var Statistics = require('../utility').statistics;
var k = require('../config').bollingerK;

function CachedBollDataPvd(pvd, N) {
    CachedStatDataPvd.call(this, pvd, N);
}

CachedBollDataPvd.prototype = Object.create(CachedStatDataPvd.prototype);

CachedBollDataPvd.prototype.getUncached = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n--;
    }
    var avg = Statistics.mean(data);
    var std = Statistics.std(data);
    return {
        'MA': avg,
        'UP': avg + k * std,
        'DW': avg - k * std
    };
}

module.exports = CachedBollDataPvd;