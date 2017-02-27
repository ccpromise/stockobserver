
var StatDataPvd = require('./StatDataPvd');
var Statistics = require('../utility').statistics;

function StdDataPvd(pvd, N) {
    StatDataPvd.call(this, pvd, N);
}

StdDataPvd.prototype = Object.create(StatDataPvd.prototype);

StdDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(this.pvd.get(ts));
        ts = this.pvd.backwardDateTs(ts, 1);
        n --;
    }
    return Statistics.std(data);
}

module.exports = StdDataPvd;
