
var validate = require('./validate');
var config = require('../config');

// refTemplate: {
// regex: new RegExp(/{{\w+}}/);
// getRef : function(reference). {{key1}} => key1
//}
module.exports = function(objTemplate, valueMap, refTemplate) {
    refTemplate = refTemplate || config.defaultRefenceTemplate;
    var validRef = {};
    Object.keys(valueMap).forEach((key) => {
        validRef[key] = true;
    })// suppose the key doesn't contain reference
    valueMap = removeReference(valueMap, {}, validRef, refTemplate);
    return removeReference(objTemplate, valueMap, validRef, refTemplate);
}

var removeReference = function(objTemplate, valueMap, validRef, refTemplate) {
    var keys = Object.keys(objTemplate);
    var N = keys.length;
    var realObj = {};
    var stack = {};

    for(var i = 0; i < N; i++) {
        var k = keys[i];
        var v = objTemplate[k];

        stack[k] = true;
        var realK = findRefValue(k, objTemplate, valueMap, stack, refTemplate, validRef); // will reference appear in obj's key or valueMap's key?
        var realV = findRefValue(v, objTemplate, valueMap, stack, refTemplate, validRef);
        realObj[realK] = realV;
        delete stack[k];
    }
    return realObj;
}

var findRefValue = function(value, objTemplate, valueMap, stack, refTemplate, validRef) {
    // return the real value of parameter 'value'
    if(validate.isNum(value) || validate.isBoolean(value)) {
        return value;
    }
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {// full match or part?
            var ref = refTemplate.getRef(value);
            if(!(ref in valueMap)) {
                if(!(ref in validRef)) throw new Error('invalid reference');
                // if we don't find a valid ref in parameter 'valueMap', it means we are removing templates in the original valueMap.
                // so the following part will only be executed when removing the reference in the original valueMap
                if(ref in stack) throw new Error('circular reference');
                stack[ref] = true;
                var refValue = findRefValue(objTemplate[ref], objTemplate, valueMap, stack, refTemplate, validRef);
                valueMap[ref] = refValue;
                delete stack[ref];
                return refValue;
            }
            return valueMap[ref];
        }
        return value;
    }
    if(validate.isArr(value)) {
        var refValue = value.map((item) => {
            return findRefValue(item,objTemplate, valueMap, stack, refTemplate, validRef);
        });
        return refValue;
    }
    if(validate.isObj(value)) {
        var keys = Object.keys(value);
        var refValue = {};
        keys.forEach((k) => {
            var v = value[k];
            var realK = findRefValue(k, objTemplate, valueMap, stack, refTemplate, validRef);
            var realV = findRefValue(v, objTemplate, valueMap, stack, refTemplate, validRef);
            refValue[realK] = realV;
        });
        return refValue;
    }
    else throw new Error(value, 'invalid value type'); // only these five kinds of data type?
}





/*
var findReference = function(value, valuMap, refTemplate) {
    if(validate.isNum(value))
        return value;
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {
            var key = refTemplate.getRef(value);
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
            var realK = findReference(k, valueMap, refValueMap, stack, refTemplate);
            var realV = findReference(v, valueMap, refValueMap, stack, refTemplate);
            realObj[realK] = realV;
        });
        return realObj;
    }
}

var removeReference = function(valueMap, refTemplate) {
    // value of each key can be : number, string, object, array.
    var keys = Object.keys(valueMap);
    var N = keys.length;
    var refValueMap = {};
    var stack = {};

    for(var i = 0; i < N; i++) {
        var k = keys[i];
        if(!(k in refValueMap)) {
            stack[k] = true;
            var v = valueMap[k];
            var realK = findRefValue(k, valueMap, refValueMap, stack, refTemplate);
            var realV = findRefValue(v, valueMap, refValueMap, stack, refTemplate);
            refValueMap[realK] = realV;
            stack[k] = false;
        }
    }

    return refValueMap;
}

var findRefValue = function(value, valueMap, refValueMap, stack, refTemplate) {
    // return the real value of parameter 'value'
    if(validate.isNum(value)) {
        return value;
    }
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {// full match or part?
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
            return findRefValue(item,valueMap, refValueMap, stack, refTemplate);
        });
        return refValue;
    }
    else if(validate.isObj(value)) {
        var keys = Object.keys(value); // will the key contain refTemplate? and some type of data cannot be key?
        var refValue = {};
        keys.forEach((k) => {
            var v = value[k];
            var realK = findRefValue(k, valueMap, refValueMap, stack, refTemplate);
            var realV = findRefValue(v, valueMap, refValueMap, stack, refTemplate);
            refValue[realK] = realV;
        });
        return refValue;
    }
    else throw new Error('invalid value type'); // only these foru kinds of data type?
}
//TODO reg exp; test the function; summary how to find the right way of dfs??

//'{{xxx}}'*/
