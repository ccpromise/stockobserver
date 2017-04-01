
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

const utility = require('../../utility');
const validate = utility.validate;
const async = utility.async;
const taskCol = require('./taskManager/db').taskCol;
const ObjectId = require('mongodb').ObjectId;
const taskStatus = require('../../constants').taskStatus;

/**
 * check validity of the input
 */
const validateMap = {
    ok: () => { return true; },
    success: validateId,
    fail: validateId,
    timeout: validate.isNum,
    and: validateArr,
    some: validateArr
}

/**
 * check if ready condtion is satisfied
 */
const checkMap = {
    ok: () => { return Promise.resolve(true); },
    success: (pack) => { return checkId(pack, taskStatus.success); },
    fail: (pack) => { return checkId(pack, taskStatus.fail); },
    timeout: (pack) => {
        return Promise.resolve(time.isAfter(time.now(), pack));
    },
    and: (pack) => {
        return async.every(pack.map((x) => {
            return function() {
                return checkReadyCondition(x.type, x.pack);
            }
        }));
    },
    some: (pack) => {
        return async.some(pack.map((x) => {
            return function() {
                return checkReadyCondition(x.type, x.pack);
            }
        }));
    }
}

function checkReadyCondition(type, pack) {
    if(!isValid(type, pack)) throw new Error('invalid type && pack: ' + type + pack);
    return checkMap[type](pack);
}

/**
 * check if type and pack are valid
 */
function isValid(type, pack) {
    if(type in validateMap && validateMap[type](pack)) return true;
    return false;
}

/**
 * check if pack is string or string array
 */
function validateId(pack) {
    return pack instanceof ObjectId || (validate.isArr(pack) && pack.every((r) => r instanceof ObjectId));
}

/**
 * check if pack is valid array of packs.
 */
function validateArr(pack) {
    return validate.isArr(pack) && pack.every((x) => { return isValid(x.type, x.pack); });
}

/**
 * check if the status of task is success
 */
function checkId(pack, status) {
    if(pack instanceof ObjectId) return checkIdHelper(pack, status);
    return async.every(pack.map((id) => {
        return function() {
            return checkIdHelper(id, status);
        }
    }));
}

function checkIdHelper(id, status) {
    return taskCol.findOne({ _id: id }).then((r) => {
        return r !== null && r.status === status;
    });
}
