
var object = require('../utility').object;

function whileAsync(promiseArr, resolve, reject) {
    var rejectedPromise = {};
    return promiseArr.reduce((pre, cur, idx) => {
        return pre.then(() => {
            return cur.then(resolve).catch((err) => {
                rejectedPromise[idx] = err;
                reject(err);
            });
        })
    }, Promise.resolve()).then(() => {
        if(object.isEmpty(rejectedPromise)) return Promise.resolve();
        return Promise.reject(rejectedPromise);
    });
}

module.exports = whileAsync;
