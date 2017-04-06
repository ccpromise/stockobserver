
const utility = require('../../../utility');
const replaceObjId = utility.replaceObjId;
const validate = utility.validate;

const verbMap = {
    'find': {
        isValid: (arg) => { return validate.isObj(arg) && validate.isObj(arg.filter) && [arg.field, arg.sort].every(validate.isUndefinedOrObj); },
        run: (col, arg) => { return col.find(arg.filter, arg.field, arg.sort); }
    },
    'findOne': {
        isValid: (arg) => { return validate.isObj(arg) && validate.isObj(arg.filter) && [arg.field, arg.opt].every(validate.isUndefinedOrObj); },
        run: (col, arg) => { return col.findOne(arg.filter, arg.field, arg.opt); }
    },
    'findAndModify': {
        isValid: (arg) => { return  validate.isObj(arg) && [arg.filter, arg.update].every(validate.isObj) && validate.isUndefinedOrObj(arg.opt)},
        run: (col, arg) => { return col.findAndModify(arg.filter, arg.update, arg.opt); }
    },
    'insert': {
        isValid: (arg) => { return  validate.isObj(arg) && validate.isObj(arg.doc) && validate.isUndefinedOrObj(arg.opt); },
        run: (col, arg) => { return col.insert(arg.doc, arg.opt); }
    },
    'upsert': {
        isValid: (arg) => { return validate.isObj(arg) && [arg.filter, arg.update].every(validate.isObj); },
        run: (col, arg) => { return col.upsert(arg.filter, arg.update); }
    },
    'update': {
        isValid: (arg) => { return validate.isObj(arg) && [arg.filter, arg.update].every(validate.isObj); },
        run: (col, arg) => { return col.update(arg.filter, arg.update); }
    },
    'updateMany': {
        isValid: (arg) => { return validate.isArr(arg) && arg.every((doc) => validate.isObj(doc) && [doc.filter, doc.update].every(validate.isObj)); },
        run: (col, arg) => { return col.updateMany(arg); }
    },
    'upsertMany': {
        isValid: (arg) => { return validate.isArr(arg) && arg.every((doc) => validate.isObj(doc) && [doc.filter, doc.update].every(validate.isObj)); },
        run: (col, arg) => { return col.upsertMany(arg); }
    },
    'insertMany': {
        isValid: (arg) => { return validate.isObj(arg) && validate.isArr(arg.docs) && arg.docs.every(validate.isObj) && validate.isUndefinedOrObj(arg.opt); },
        run: (col, arg) => { return col.insertMany(arg.docs, arg.opt); }
    },
    'remove': {
        isValid: (arg) => { return validate.isObj(arg) && validate.isObj(arg.filter) && validate.isUndefinedOrObj(arg.opt); },
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
exports.run = function(col, arg, verb) {
    if(!exports.isValid(verb, arg)) {
        return Promise.reject(400);
    }
    arg = replaceObjId(arg);
    return verbMap[verb].run(col, arg);
}
