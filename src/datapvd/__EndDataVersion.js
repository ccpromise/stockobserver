
var time = require('../utility').time;

function EndDataPvd(stock) {
    var min = time.getDateTs(time.now());
    var max = -1;
    for(ts in stock) {
        var n = Number(ts);
        min = Math.min(min, n);
        max = Math.max(max, n);
    }
    this.stock = stock;
    this.minTs = max == -1 ? -1 : min;
    this.maxTs = max;
}

EndDataPvd.prototype.hasDef = function(ts) {
    return ts in this.stock && ts >= this.minTs && ts <= this.maxTs;
}

EndDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    return this.stock[ts]['e'];
}


HistoryEndDataPvd.prototype.getNearTs = function(ts, n) {
    var inc = n > 0 ? 1 : -1;
    while(ts+inc >= this.realMinTs && ts+inc <= this.realMaxTs && n != 0) {
        ts += inc;
        while(!(ts in this.stock)) ts += inc;
        n -= inc;
    }
    return n == 0 ? ts : -1;
};

function HistoryEndDataPvd(stock, N) {
    EndDataPvd.call(this, stock);
    this.N = N;
    this.realMinTs = this.minTs;
    this.realMaxTs = this.maxTs;
    this.minTs = this.getNearTs(this.realMinTs, N-1);
    this.maxTs = this.minTs == -1 ? -1 : this.realMaxTs;
}

HistoryEndDataPvd.prototype.hasDef = EndDataPvd.prototype.hasDef;

HistoryEndDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = [];
    var n = this.N;
    while(n > 0) {
        data.push(EndDataPvd.prototype.get.call(this, ts));
        ts = this.getNearTs(ts, -1);
        n--;
    }
    return data;
}


StdDataPvd.prototype.getNearTs = HistoryEndDataPvd.prototype.getNearTs;

function StdDataPvd(stock, N) {
    HistoryEndDataPvd.call(this, stock, N);
}

StdDataPvd.prototype.hasDef = EndDataPvd.prototype.hasDef;

StdDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = HistoryEndDataPvd.prototype.get.call(this, ts);
    var ma = data.reduce((pre, cur) => { return pre+cur; }) / this.N;
    return Math.sqrt(data.reduce((pre, cur) => { return pre+Math.pow(cur-ma, 2); }, 0)/this.N);
}

MADataPvd.prototype.getNearTs = HistoryEndDataPvd.prototype.getNearTs;

function MADataPvd(stock, N) {
    HistoryEndDataPvd.call(this, stock, N);
}

MADataPvd.prototype.hasDef = EndDataPvd.prototype.hasDef;

MADataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = HistoryEndDataPvd.prototype.get.call(this, ts);
    return data.reduce((pre, cur) => { return pre+cur; }) / this.N;
}


BollDataPvd.prototype.getNearTs = HistoryEndDataPvd.prototype.getNearTs;

function BollDataPvd(stock, N) {
    HistoryEndDataPvd.call(this, stock, N);
}

BollDataPvd.prototype.hasDef = EndDataPvd.prototype.hasDef;

BollDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) return 'invalid ts';
    var data = HistoryEndDataPvd.prototype.get.call(this, ts);
    var ma = data.reduce((pre, cur) => { return pre+cur; }) / this.N;
    var std = Math.sqrt(data.reduce((pre, cur) => { return pre+Math.pow(cur-ma, 2); }, 0)/this.N);
    return {
        'MB': ma,
        'UP': ma + 2 * std,
        'DW': ma - 2 * std,
    }
}

exports.EndDataPvd = EndDataPvd;
exports.HistoryEndDataPvd = HistoryEndDataPvd;
exports.MADataPvd = MADataPvd;
exports.StdDataPvd = StdDataPvd;
exports.BollDataPvd = BollDataPvd;
