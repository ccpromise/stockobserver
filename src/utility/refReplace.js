
const validate = require('./validate');
const defaultRefenceTemplate = {
    'regex': /{{\w+}}/,
    'getRef': function(s) {
        return s.slice(2, -2);
    }
}

/**
 * replace reference in template using valueMap
 * accept value type: number, string, boolean, array and object
 * example ->
 * template: {
 * name: {{key1}}
 * }
 * valueMap: {
 * key1: 'cc'
 * }
 * so return {
 * name: 'cc'
 * }
 */
module.exports = function(template, valueMap, refTemplate) {
    refTemplate = refTemplate || defaultRefenceTemplate;
    return findRefValue(template, valueMap, Object.create(null), Object.create(null), refTemplate);
}

var findRefValue = function(value, valueMap, refValueMap, processingRef, refTemplate) {
    if(validate.isNum(value) || validate.isBoolean(value)) {
        return value;
    }
    if(validate.isStr(value)) {
        if(refTemplate.regex.test(value)) {
            var key = refTemplate.getRef(value);
            if(!(key in refValueMap)) {
                if(!(key in valueMap)) throw new Error('invalid reference');
                if(key in processingRef) throw new Error('circular reference');
                processingRef[key] = true;
                var refValue = findRefValue(valueMap[key], valueMap, refValueMap, processingRef, refTemplate);
                refValueMap[key] = refValue;
                return refValue;
            }
            return refValueMap[key];
        }
        return value;
    }
    else if(validate.isArr(value)) {
        var refValue = value.map((item) => {
            return findRefValue(item, valueMap, refValueMap, processingRef, refTemplate);
        });
        return refValue;
    }
    else if(validate.isObj(value)) {
        var keys = Object.keys(value);
        var refValue = {};
        keys.forEach((k) => {
            refValue[k] = findRefValue(value[k], valueMap, refValueMap, processingRef, refTemplate);
        });
        return refValue;
    }
    else throw new Error('invalid value type');
}
