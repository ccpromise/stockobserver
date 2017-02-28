
var StatDataPvd = require('./StatDataPvd');
var Statistics = require('../../utility').statistics;

function MADataPvd(pvd, N) {
    StatDataPvd.call(this, pvd, N);
}

MADataPvd.prototype = Object.create(StatDataPvd.prototype);

MADataPvd.prototype._calculate = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts!');
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n--;
    }
    return Statistics.mean(data);
}

module.exports = MADataPvd;
