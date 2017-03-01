
var DataPvd = require('./DataPvd');
var cache = require('../../utility/cache');
var msg = 'Not Implemented';

function CachedDataPvd() {
    DataPvd.call(this);
    this._cache = new cache();
}

CachedDataPvd.prototype = Object.create(DataPvd.prototype);

CachedDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    if(!this._cache.has(ts))
        this._cache.set(ts, this._calculate(ts));
    return this._cache.get(ts);
}

// if not cached, calculate according to ts.
CachedDataPvd.prototype._calculate = function(ts) {
    throw new Error(msg);
}

module.exports = CachedDataPvd;
