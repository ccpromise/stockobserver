
/**
 * async version of Array.forEach()
 * apply iterator to each promise in list in sequence.
 */

exports.forEach = function(list, iterator) {
    return list.reduce((pre, cur) => {
        return pre.then(() => {
            return iterator(cur);
        });
    }, Promise.resolve());
}

/**
 * async while.
 * call action, which return a promise, in sequence while condition is true.
 */
exports.while = function(condition, action) {
    var iter = function() {
        if(!condition()) return Promise.resolve();
        return action().then(iter);
    }
    return iter();
}

/**
 * async do while.
 */
exports.doWhile = function(condition, action) {
    var iter = function() {
        if(!condition()) return Promise.resolve();
        return action().then(iter);
    }
    return action().then(iter);
}

/**
 * execute at most N promises in parallel.
 */
exports.parallel = function(hasNext, next, N) {
    var iter = function() {
        if(!hasNext()) return Promise.resolve();
        return next().then(iter);
    }
    var handler = [];
    while(handler.length < N && hasNext()) {
        handler.push(iter());
    }
    return Promise.all(handler);
}

/**
 * async every
 */
exports.every = function(actions) {
    var i = 0;
    var N = actions.lenth;
    var res = true;

    return exports.while(() => {
        return i < N && res;
    }, () => {
        return actions[i++]().then((r) =>{
            res = r;
        });
    }).then(() =>  { return res; });
}

/**
 * async some
 */
exports.some = function(actions) {
    var i = 0;
    var N = actions.lenth;
    var res = false;

    return exports.while(() => {
        return i < N && !res;
    }, () => {
        return actions[i++]().then((r) =>{
            res = r;
        });
    }).then(() =>  { return res; });
}
