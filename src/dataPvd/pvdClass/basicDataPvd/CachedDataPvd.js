
var DataPvd = require('./DataPvd');
var cacheFunc = require('../../../utility').cacheFunc;
var msg = 'Not Implemented';

function CachedDataPvd(id) {
    DataPvd.call(this, id);
    this._cacheGet = cacheFunc(this._calculate);
}

CachedDataPvd.prototype = Object.create(DataPvd.prototype);

CachedDataPvd.prototype.get = function(ts) {
    return this._cacheGet(ts);
}

/*
function(ts) {

    if(!this.hasDef(ts)) throw new Error('invalid ts');
    if(!this._cache.has(ts))
        this._cache.set(ts, this._calculate(ts));
    return this._cache.get(ts);
}
*/

// if not cached, calculate according to ts.
CachedDataPvd.prototype._calculate = function(ts) {
    throw new Error(msg);
}

module.exports = CachedDataPvd;
