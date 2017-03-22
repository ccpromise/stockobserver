
var taskCol = require('./db').taskCol;

module.exports = function(obj) {
    var res = obj.res;
    taskCol.findReadyTask().then((r) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(r));
    }, (err) => {
        res.writeHead(500, { 'content-type': 'text/plain' });
        res.end(JSON.stringify(null));
        console.log('err when calling task.getReadyTask, err: ', err);
    });
}
