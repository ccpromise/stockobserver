
var CachedStatDataPvd = require('./CachedStatDataPvd');
var Statistics = require('../utility').statistics;

function CachedMADataPvd(pvd, N) {
    CachedStatDataPvd.call(this, pvd, N);
}

CachedMADataPvd.prototype = Object.create(CachedStatDataPvd.prototype);

CachedMADataPvd.prototype.getUncached = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts!';
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n--;
    }
    return Statistics.mean(data);
}

module.exports = CachedMADataPvd;
