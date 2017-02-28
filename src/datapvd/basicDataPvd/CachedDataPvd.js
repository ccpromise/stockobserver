
var DataPvd = require('./DataPvd');
var cache = require('js-cache');
var cacheTime = require('../../config').cacheTime;
var msg = 'Not Implemented';

function CachedDataPvd() {
    DataPvd.call(this);
    this._cache = new cache();
}

CachedDataPvd.prototype = Object.create(DataPvd);

CachedDataPvd.prototype.cacheTime = cacheTime;

CachedDataPvd.prototype.get = function(ts) {
    if(!this.hasDef(ts)) throw 'invalid ts';
    if(!this._cache.get(ts))
        this._cache.set(ts, this._calculate(ts), this.cacheTime);
    return this._cache.get(ts);
}

// if not cached, calculate according to ts.
CachedDataPvd.prototype._calculate = function(ts) {
    throw new Error(msg);
}

// if cached, return obj, else return undefined.
CachedDataPvd.prototype._getCached = function(ts) {
    return this._cache.get(ts);
}

module.exports = CachedDataPvd;
