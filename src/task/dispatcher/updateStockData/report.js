
var taskCol = require('./db').taskCol;
var ObjectId = require('mongodb').ObjectId;

module.exports = function(obj) {
    var req = obj.req;
    var res = obj.res;
    var data = [];
    req.on('data', (chunk) => {
        data.push(chunk);
    });
    req.on('end', () => {
        var result = null;
        try {
            result = JSON.parse(Buffer.concat(data).toString());
        }
        catch (err) {
            res.writeHead(400);
            res.end();
            return;
        }
        console.log('receive result from consumer: ', JSON.stringify(result));
        taskCol.checkResultValidity(result).then((r) => {
            var id = new ObjectId(result.id);
            if(r) {
                return taskCol.update({
                    _id: id
                }, {
                    $set: { status: result.status },
                    $push: { log: result.log }
                }).then(() => {
                    console.log('receive result and update collection.');
                    res.writeHead(200);
                    res.end();
                });
            }
            else {
                res.writeHead(400);
                res.end('result is invalid for the task.');
            }
        }).catch((err) => {
            res.writeHead(500);
            res.end('server error');
        });
    });
}
