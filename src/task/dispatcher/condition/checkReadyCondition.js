
/**
 * check if a waiting task should be converted to ready.
 * usage sample:
 * var checker = require('./checkReadyCondition');
 * checker(type, pack).then((r) => {
 * if(r) console.log('waiting task is ready to execute.');
 * else console.log('task keeps waitint...');
 * })
 */
module.exports = checkReadyCondition;

const utility = require('../../../utility');
const validate = utility.validate;
const async = utility.async;
const taskCol = require('../handlers/task/db').taskCol;
const ObjectId = require('mongodb').ObjectId;
const taskStatus = require('../../../constants').taskStatus;
const err = new Error('invalid type and pack');

/**
 * check if ready condtion is satisfied
 */
const checkMap = {
    ok: {
        validate: () => { return true; },
        handler: () => { return Promise.resolve(true); }
    },
    success: {
        validate: validateId,
        handler: (pack) => { return checkTaskStatus(pack, taskStatus.success); }
    },
    fail: {
        validate: validateId,
        handler: (pack) => { return checkTaskStatus(pack, taskStatus.fail); }
    },
    timeout: {
        validate: validate.isPosInt,
        handler: (pack) => { return Promise.resolve(time.isAfter(time.now(), pack)); },
    },
    and: {
        validate: validateArr,
        handler: (pack) => {
            return async.every(pack.map((x) => {
                return function() {
                    return checkReadyCondition(x.type, x.pack);
                }
            }));
        }
    },
    or: {
        validate: validateArr,
        handler: (pack) => {
            return async.some(pack.map((x) => {
                return function() {
                    return checkReadyCondition(x.type, x.pack);
                }
            }));
        }
    }
}

function checkReadyCondition(type, pack) {
    if(!isValid(type, pack)) {
        return Promise.reject(new Error('invalid type and pack'));
    }
    return checkMap[type].handler(pack);
}

function isValid(type, pack) {
    return type in checkMap && checkMap[type].validate(pack);
}

/**
 * check if pack is string or string array
 */
function validateId(pack) {
    return ObjectId.isValid(pack) || (validate.isArr(pack) && pack.every((r) => ObjectId.isValid(pack)));
}

/**
 * check if pack is valid array of packs.
 */
function validateArr(pack) {
    return validate.isArr(pack) && pack.length >= 2 && pack.every((x) => { return isValid(x.type, x.pack); });
}

/**
 * check the status of task
 */
function checkTaskStatus(pack, status) {
    if(ObjectId.isValid(pack)) return checkTaskStatusHelper(pack, status);
    return async.every(pack.map((id) => {
        return function() {
            return checkTaskStatusHelper(id, status);
        }
    }));
}

function checkTaskStatusHelper(id, status) {
    return taskCol.findOne({ _id: id }).then((r) => {
        return r !== null && r.status === status;
    });
}
