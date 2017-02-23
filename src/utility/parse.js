
// return: { key: {k1:v1, k2:v2}}
// fields[0]: key
// keys: [k1, k2]
// fileds[1:]: [v1, v2]
exports.parseObjArr = function(objArr, fields, keys, func) {
    var res = {};
    objArr.forEach((obj) => {
        var newObj = {};
        var len = keys.length;
        for(var i = 0; i < len; i++) {
            newObj[keys[i]] = obj[fields[i+1]];
        }
        func = func || (x => x);
        res[func(obj[fields[0]])] = newObj;
    });
    return res;
}
