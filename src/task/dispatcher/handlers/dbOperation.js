
const replaceObjId = require('../../../utility').replaceObjId;
const opMap = {
    'find': (col, arg) => { return col.find(arg.filter, arg.field, arg.sort); },
    'findOne': (col, arg) => { return col.findOne(arg.filter, arg.field, arg.opt); },
    'findAndModify': (col, arg) => { return col.findAndModify(arg.filter, arg.field, arg.opt); },
    'insert': (col, arg) => { return col.insert(arg.doc, arg.opt); },
    'upsert': (col, arg) => { return col.upsert(arg.filter, arg.update); },
    'update': (col, arg) => { return col.update(arg.filter, arg.update); },
    'updateMany': (col, arg) => { return col.updateMany(arg); },
    'upsertMany': (col, arg) => { return col.upsertMany(arg); },
    'insertMany': (col, arg) => { return col.insertMany(arg.docs, arg.opt); },
    'remove': (col, arg) => { return col.remove(arg.filter, arg.opt); }
}

/**
 * General collection operation handler.
 */
module.exports = function(col, arg, verb, res) {
    arg = replaceObjId(arg);
    var promise = null;
    if(verb in opMap) {
        return opMap[verb](col, arg).then((r) => {
            res.writeHead(200);
            res.end(JSON.stringify(r));
        });
    }
    else {
        return Promise.resolve().then(() => {
            res.writeHead(400);
            res.end();
        });
    }
}
