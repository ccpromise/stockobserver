
/**
 * create a cache version of pure function.
 * restrict to pass one argument to the original function
 */
module.exports = function(func) {
    var cache = Object.create(null);
    return function(arg) {
        var hit = cache[arg];
        return hit || (cache[arg] = func(arg));
    }
}
