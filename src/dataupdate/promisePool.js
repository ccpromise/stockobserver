
var object = require('../utility').object;

var promisePool = function(promises, resolve, reject, N) {
    function PromiseHandler(idx) {
        return promises[idx].then(resolve).catch((err) => {
            rejectedPromises[idx] = err;
            reject(err);
        }).then(() => {
            if(next < total) return PromiseHandler(next++);
            return Promise.resolve();
        });
    }
    var next = 0;
    var total = promises.length;
    var handlers = [];
    var rejectedPromises = {};

    for(var i = 0; i < N && next < total; i++) {
        handlers.push(PromiseHandler(next++));
    }
    return Promise.all(handlers).then(() => {
        if(object.isEmpty(rejectedPromises)) return Promise.resolve();
        return Promise.reject(rejectedPromises);
    });
}

module.exports = promisePool;
