var forEach = function(list, iterator) {
    return list.reduce((pre, cur) => {
        return pre.then(() => {
            return iterator(cur);
        });
    }, Promise.resolve());
}

var While = function(condition, action) {
    var iter = function() {
        if(!condition()) return Promise.resolve();
        return action().then(iter);
    }
    return iter();
}

var parallel = function(hasNext, next, N) {
    var iter = function() {
        if(!hasNext()) return Promise.resolve();
        return next().then(iter);
    }
    var handler = [];
    var i = 0;
    while(i < N && hasNext()) {
        handler[i++] = iter();
    }
    return Promise.all(handler);
}

exports.forEach = forEach;
exports.while = While;
exports.parallel = parallel;
