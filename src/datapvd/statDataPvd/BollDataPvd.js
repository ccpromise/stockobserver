
var StatDataPvd = require('./StatDataPvd');
var Statistics = require('../../utility').statistics;
var k = require('../../config').bollingerK;

function BollDataPvd(pvd, N) {
    StatDataPvd.call(this, pvd, N);
}

BollDataPvd.prototype = Object.create(StatDataPvd.prototype);

BollDataPvd.prototype._calculate = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
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

module.exports = BollDataPvd;
