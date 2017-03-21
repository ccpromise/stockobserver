
var validate = require('./validate');
var config = require('../config');

// refTemplate: {
// regex: new RegExp(/{{\w+}}/);
// getRef : function(reference). {{key1}} => key1
//}
module.exports = function(objTemplate, valueMap, refTemplate) {
    refTemplate = refTemplate || config.defaultRefenceTemplate;
    realValueMap = clearValueMap(valueMap, refTemplate);
    return removeReference(objTemplate, realValueMap, refTemplate);
}


var removeReference = function(objTemplate, valueMap, refTemplate) {
    var keys = Object.keys(objTemplate);
    var N = keys.length;
    var realObj = {};

    for(var i = 0; i < N; i++) {
        var k = keys[i];
        realObj[k] = repReference(objTemplate[k], valueMap, refTemplate);
    }
    return realObj;
}

var repReference = function(value, valueMap, refTemplate) {
    if(validate.isNum(value) || validate.isBoolean(value))
        return value;
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {
            var key = refTemplate.getRef(value);
            if(!(key in valueMap)) throw new Error('invalid reference');
            return valueMap[key];
        }
        return value;
    }
    if(validate.isArr(value)) {
        return value.map((item) => {
            return repReference(item, valueMap, refTemplate);
        });
    }
    if(validate.isObj(value)) {
        var keys = Object.keys(value);
        var realObj = {};
        keys.forEach((k) => {
            realObj[k] = repReference(value[k], valueMap, refTemplate);
        });
        return realObj;
    }
}

var clearValueMap = function(valueMap, refTemplate) {
    var keys = Object.keys(valueMap);
    var N = keys.length;
    var refValueMap = {};
    var stack = {};

    for(var i = 0; i < N; i++) {
        var k = keys[i];
        if(!(k in refValueMap)) {
            stack[k] = true;
            refValueMap[k] = findRefValue(valueMap[k], valueMap, refValueMap, stack, refTemplate);
            stack[k] = false;
        }
    }
    return refValueMap;
}

var findRefValue = function(value, valueMap, refValueMap, stack, refTemplate) {
    if(validate.isNum(value) || validate.isBoolean(value)) {
        return value;
    }
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {
            var key = refTemplate.getRef(value);
            if(!(key in refValueMap)) {
                if(!(key in valueMap)) throw new Error('invalid reference');
                if(key in stack) throw new Error('circular reference');
                stack[key] = true;
                var refValue = findRefValue(valueMap[key], valueMap, refValueMap, stack, refTemplate);
                refValueMap[key] = refValue;
                stack[key] = false;
                return refValue;
            }
            return refValueMap[key];
        }
        return value;
    }
    else if(validate.isArr(value)) {
        var refValue = value.map((item) => {
            return findRefValue(item, valueMap, refValueMap, stack, refTemplate);
        });
        return refValue;
    }
    else if(validate.isObj(value)) {
        var keys = Object.keys(value);
        var refValue = {};
        keys.forEach((k) => {
            refValue[k] = findRefValue(value[k], valueMap, refValueMap, stack, refTemplate);
        });
        return refValue;
    }
    else throw new Error('invalid value type');
}
