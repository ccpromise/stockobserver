
var cache = function () {
    this._cache = {};
}

cache.prototype.has = function(key) {
    return key in this._cache;
}

cache.prototype.get = function(key) {
    return this._cache[key];
}

cache.prototype.set = function(key, val) {
    return this._cache[key] = val;
}

module.exports = cache;
