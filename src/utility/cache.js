
function cache() {
    this._data = {};
}

cache.prototype.get = function(key) {
    if(!(key in this._data)) throw new Error('cache key error');
    return this._data[key];
}

cache.prototype.set = function(key, value) {
    this._data[key] = value;
    this._maxKey = Math.max(this._maxKey, key);
}

cache.prototype.has = function(key) {
    return key in this._data;
}

cache.prototype.size = function() {
    return Object.keys(this._data).length;
}

module.exports = cache;
