
var replaceObjId = require('../../utility').replaceObjId;

// General collection operation handler.
module.exports = function(col, arg, verb, res) {
    arg = replaceObjId(arg);
    var promise = null;
    if(verb === 'find' || verb === 'findOne' || verb === 'findAndModify') {
        promise = col[verb](arg.filter, arg.field, arg.opt);
    }
    else if(verb === 'insert') {
        promise = col[verb](arg.doc, arg.opt);
    }
    else if(verb === 'upsert' || verb === 'update') {
        promise = col[verb](arg.filter, arg.update);
    }
    else if(verb === 'updateMany' || verb === 'upsertMany') {
        promise = col[verb](arg);
    }
    else if(verb === 'insertMany') {
        promise = col[verb](arg.docs, arg.opt);
    }
    else if(verb === 'remove') {
        promise = col[verb](arg.filter, arg.opt);
    }
    else {
        res.writeHead(400);
        res.end();
        return;
    }
    promise.then((r) => {
        res.writeHead(200);
        res.end(JSON.stringify(r));
    }).catch((err) => {
        res.writeHead(500);
        res.end();
        console.log(err);
    });
}
