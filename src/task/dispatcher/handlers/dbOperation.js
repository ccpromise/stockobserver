
const utility = require('../../../utility');
const replaceObjId = utility.replaceObjId;
const validate = utility.validate;

const verbMap = {
    'find': {
        isValid: (arg) => { return isValidHelper(arg, 'filter'); },
        run: (col, arg) => { return col.find(arg.filter, arg.field, arg.sort); }
    },
    'findOne': {
        isValid: (arg) => { return isValidHelper(arg, 'filter'); },
        run: (col, arg) => { return col.findOne(arg.filter, arg.field, arg.opt); }
    },
    'findAndModify': {
        isValid: (arg) => { return isValidHelper(arg, ['filter', 'field']); },
        run: (col, arg) => { return col.findAndModify(arg.filter, arg.field, arg.opt); }
    },
    'insert': {
        isValid: (arg) => { return isValidHelper(arg, 'doc'); },
        run: (col, arg) => { return col.insert(arg.doc, arg.opt); }
    },
    'upsert': {
        isValid: (arg) => { return isValidHelper(arg, ['filter', 'update']); },
        run: (col, arg) => { return col.upsert(arg.filter, arg.update); }
    },
    'update': {
        isValid: (arg) => { return isValidHelper(arg, ['filter', 'update']); },
        run: (col, arg) => { return col.update(arg.filter, arg.update); }
    },
    'updateMany': {
        isValid: (arg) => { return validate.isArr(arg) && arg.every((doc) =>isValidHelper(doc, ['filter', 'update'])); },
        run: (col, arg) => { return col.updateMany(arg); }
    },
    'upsertMany': {
        isValid: (arg) => { return validate.isArr(arg) && arg.every((doc) =>isValidHelper(doc, ['filter', 'update'])); },
        run: (col, arg) => { return col.upsertMany(arg); }
    },
    'insertMany': {
        isValid: (arg) => { return isValidHelper(arg, 'docs'); },
        run: (col, arg) => { return col.insertMany(arg.docs, arg.opt); }
    },
    'remove': {
        isValid: (arg) => { return isValidHelper(arg, 'filter'); },
        run: (col, arg) => { return col.remove(arg.filter, arg.opt); }
    }
}

/**
 * check validity of parameter
 */
exports.isValid = function(verb, arg) {
    try {
        arg = replaceObjId(arg);
        return verb in verbMap && verbMap[verb].isValid(arg);
    }
    catch (err) {
        return false;
    }
}

/**
 * General collection operation handler.
 */
exports.run = function(col, arg, verb, res) {
    if(!exports.isValid(verb, arg)) {
        return Promise.resolve().then(() => {
            res.writeHead(400);
            res.end();
        });
    }
    arg = replaceObjId(arg);
    return verbMap[verb].run(col, arg).then((r) => {
        res.writeHead(200);
        res.end(JSON.stringify(r));
    });
}

function isValidHelper(arg, properties) {
    return validate.isObj(arg) && validate.hasOwnProperty(arg, properties);
}
