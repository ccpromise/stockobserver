
var validate = require('./validate');
var config = require('../config');

// refTemplate: {
// regex: new RegExp(/{{\w+}}/);
// getKey : function(reference). {{key1}} => key1
//}
module.exports = function(objTemplate, valueMap, refTemplate) {
    refTemplate = refTemplate || config.defaultRefenceTemplate;
    var validRef = {};
    Object.keys(valueMap).forEach((key) => {
        validRef[key] = true;
    })// suppose the key doesn't contain reference
    valueMap = rmTemplate(valueMap, {}, validRef, refTemplate);
    return rmTemplate(objTemplate, valueMap, validRef, refTemplate);
}

var rmTemplate = function(objTemplate, valueMap, validRef, refTemplate) {
    var keys = Object.keys(objTemplate);
    var N = keys.length;
    var realObj = {};
    var stack = {};

    for(var i = 0; i < N; i++) {
        var k = keys[i];
        var v = objTemplate[k];

        stack[k] = true;
        var realK = findRealValue(k, objTemplate, valueMap, stack, refTemplate, validRef); // will reference appear in obj's key or valueMap's key?
        var realV = findRealValue(v, objTemplate, valueMap, stack, refTemplate, validRef);
        realObj[realK] = realV;
        delete stack[k];
    }
    return realObj;
}

var findRealValue = function(value, objTemplate, valueMap, stack, refTemplate, validRef) {
    // return the real value of parameter 'value'
    if(validate.isNum(value) || validate.isBoolean(value)) {
        return value;
    }
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {// full match or part?
            var key = refTemplate.getKey(value);
            if(!(key in valueMap)) {
                if(!(key in validRef)) throw new Error(typeo, ' invalid reference');
                // if we don't find a valid key in parameter 'valueMap', it means we are remove templates in the original valueMap.
                // so the following part will only be executed when removing the reference in the original valueMap
                if(key in stack) throw new Error('circular reference');
                stack[key] = true;
                var realValue = findRealValue(objTemplate[key], objTemplate, valueMap, stack, refTemplate, validRef);
                valueMap[key] = realValue;
                delete stack[key];
                return realValue;
            }
            return valueMap[key];
        }
        return value;
    }
    if(validate.isArr(value)) {
        var realValue = value.map((item) => {
            return findRealValue(item,objTemplate, valueMap, stack, refTemplate, validRef);
        });
        return realValue;
    }
    if(validate.isObj(value)) {
        var keys = Object.keys(value);
        var realValue = {};
        keys.forEach((k) => {
            var v = value[k];
            var realK = findRealValue(k, objTemplate, valueMap, stack, refTemplate, validRef);
            var realV = findRealValue(v, objTemplate, valueMap, stack, refTemplate, validRef);
            realValue[realK] = realV;
        });
        return realValue;
    }
    else throw new Error(value, 'invalid value type'); // only these five kinds of data type?
}





/*
var findReference = function(value, valuMap, refTemplate) {
    if(validate.isNum(value))
        return value;
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {
            var key = refTemplate.getKey(value);
            if(!(key in valueMap)) throw new Error('invalid reference');
            return valueMap[value];
        }
        return value;
    }
    if(validate.isArr(value)) {
        return value.map((item) => {
            return findReference(item, valueMap, refTemplate);
        });
    }
    if(validate.isObj(value)) {
        var keys = Object.keys(value);
        var realObj = {};
        keys.forEach((k) => {
            var v = value[k];
            var realK = findReference(k, valueMap, realValueMap, stack, refTemplate);
            var realV = findReference(v, valueMap, realValueMap, stack, refTemplate);
            realObj[realK] = realV;
        });
        return realObj;
    }
}

var rmTemplate = function(valueMap, refTemplate) {
    // value of each key can be : number, string, object, array.
    var keys = Object.keys(valueMap);
    var N = keys.length;
    var realValueMap = {};
    var stack = {};

    for(var i = 0; i < N; i++) {
        var k = keys[i];
        if(!(k in realValueMap)) {
            stack[k] = true;
            var v = valueMap[k];
            var realK = findRealValue(k, valueMap, realValueMap, stack, refTemplate);
            var realV = findRealValue(v, valueMap, realValueMap, stack, refTemplate);
            realValueMap[realK] = realV;
            stack[k] = false;
        }
    }

    return realValueMap;
}

var findRealValue = function(value, valueMap, realValueMap, stack, refTemplate) {
    // return the real value of parameter 'value'
    if(validate.isNum(value)) {
        return value;
    }
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {// full match or part?
            var key = refTemplate.getKey(value);
            if(!(key in realValueMap)) {
                if(!(key in valueMap)) throw new Error('invalid reference');
                if(key in stack) throw new Error('circular reference');
                stack[key] = true;
                var realValue = findRealValue(valueMap[key], valueMap, realValueMap, stack, refTemplate);
                realValueMap[key] = realValue;
                stack[key] = false;
                return realValue;
            }
            return realValueMap[key];
        }
        return value;
    }
    else if(validate.isArr(value)) {
        var realValue = value.map((item) => {
            return findRealValue(item,valueMap, realValueMap, stack, refTemplate);
        });
        return realValue;
    }
    else if(validate.isObj(value)) {
        var keys = Object.keys(value); // will the key contain refTemplate? and some type of data cannot be key?
        var realValue = {};
        keys.forEach((k) => {
            var v = value[k];
            var realK = findRealValue(k, valueMap, realValueMap, stack, refTemplate);
            var realV = findRealValue(v, valueMap, realValueMap, stack, refTemplate);
            realValue[realK] = realV;
        });
        return realValue;
    }
    else throw new Error('invalid value type'); // only these foru kinds of data type?
}
//TODO reg exp; test the function; summary how to find the right way of dfs??

//'{{xxx}}'*/
