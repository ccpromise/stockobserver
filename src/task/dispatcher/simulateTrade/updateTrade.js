
var simulateCol = require('./db').simulateCol;

module.exports = function(obj) {
    var req = obj.req;
    var res = obj.res;
    var data = [];
    req.on('data', (chunk) => {
        data.push(chunk);
    });
    req.on('end', () => {
        var docs = null;
        try {
            docs = JSON.parse(Buffer.concat(data).toString());
        }
        catch (err) {
            res.writeHead(400);
            res.end();
            return;
        }
        isValid(docs).then((r) => {
            if(!r) {
                res.writeHead(400);
                res.end();
                return;
            }
            var updates = docs.map((doc) => {
                return {
                    filter: { _id: doc._id },
                    update: { $set: { tradeplanId: doc.tradeplanId, secID: doc.secID, sdts: doc.sdts, edts: doc.edts, hdts: doc.hdts, ldts: doc.ldts, sp: doc.sp, ep: doc.ep, hp: doc.hp, lp: doc.lp, closed: doc.closed } }
                }
            })
            return simulateCol.upsertMany(updates).then((r) => {
                res.writeHead(200);
                res.end();
            });
        }).catch((err) => {
            res.writeHead(500);
            res.end();
        })
    })
}

// do we need to check the validation of the data?
var isValid = function(docs) {
    return Promise.resolve(true);
}
