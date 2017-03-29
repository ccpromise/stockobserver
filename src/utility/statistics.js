
/**
 * mean value of array
 */
exports.mean = function(arr) {
    return arr.reduce((pre, cur) => { return pre + cur;}) / arr.length;
};

/**
 * standard deviration of array
 */
exports.std = function(arr) {
    var m = exports.mean(arr);
    return Math.sqrt(arr.reduce((pre, cur) => { return pre + Math.pow(cur - m, 2); }, 0) / arr.length);
};
