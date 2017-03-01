
var constructors = require('../datapvd');
var validate = require('../utility').validate;
var existObj = {};

function makeDataPvd(pvdName, paras) {
    // check the validality of input
    if(pvdName in argsList) {
        var len = paras.length;
        var args = argsList[pvdName];
        if(len !== args.length)
            throw new Error('invalid parameters');
        for(var i = 0; i < len; i++) {
            if(!validate[args[i]](paras[i]))
                throw new Error('invalid parameters');
        }
    }
    else
        throw new Error('invalid datapvd type');

    var id = '';
    paras.forEach((item) => {
        if(validate.isArr(item)) {
            item.forEach((p) => {
                id = '_' + (p['id'] ? p['id'] : JSON.stringify(p)) + id;
            });
        }
        else {
            id = '_' + (item['id'] ? item['id'] : JSON.stringify(item)) + id;
        }
    })
    id = pvdName + id;
    if(id in existObj) {
        console.log('Old object returned(id=', id, ')');
        return existObj[id];
    }
    else {
        var constFunc = constructors[pvd[pvdName]];
        var obj = newConstructor(constFunc, paras);
        existObj[id] = obj;
        obj['id'] = id;
        console.log('New object created(id = ', id, '). ', 'Current total pvds: ', Object.keys(existObj).length);
        return obj;
    }
}

var argsList = {
    'const': ['isAny'],
    'offset': ['isDataPvd', 'isNum'],
    'add': ['isDataPvdArr'],
    'div': ['isDataPvdArr'],
    'mul': ['isDataPvdArr'],
    'sub': ['isDataPvdArr'],
    'boll': ['isDataPvd', 'isNum'],
    'ema': ['isDataPvd', 'isNum'],
    'macd': ['isDataPvd'],
    'ma': ['isDataPvd', 'isNum'],
    'end': ['isStock']
}

var pvd = {
    'const': 'ConstDataPvd',
    'offset': 'OffsetDataPvd',
    'add': 'AddDataPvd',
    'div': 'DivDataPvd',
    'sub': 'SubDataPvd',
    'mul': 'MulDataPvd',
    'boll': 'BollDataPvd',
    'ema': 'EMADataPvd',
    'macd': 'MACDDataPvd',
    'ma': 'MADataPvd',
    'end': 'EndDataPvd'
}

function newConstructor(constructor, args) {
    function f() {
        return constructor.apply(this, args);
    }
    f.prototype = constructor.prototype;
    f.constructor = constructor;
    return new f();
}

module.exports = makeDataPvd;
