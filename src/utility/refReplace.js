
var validate = require('./validate');
var config = require('../config');

// refTemplate: {
// regex: new RegExp(/{{\w+}}/);
// getRef : function(reference). {{key1}} => key1
//}
module.exports = function(template, valueMap, refTemplate) {
    refTemplate = refTemplate || config.defaultRefenceTemplate;
    return findRefValue(template, valueMap, {}, {}, refTemplate);
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
