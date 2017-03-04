
var DataPvd = require('../datapvd');
var utility = require('../utility');
var validate = utility.validate;
var existObj = {};
var cachedPvdList = {'ma': true, 'std': true, 'boll': true, 'ema': true, 'macd': true}
var pvdList = {
    'ma': DataPvd.MADataPvd,
    'std': DataPvd.StdDataPvd,
    'boll': DataPvd.BollDataPvd,
    'ema': DataPvd.EMADataPvd,
    'macd': DataPvd.MACDDataPvd,
    'add': DataPvd.AddDataPvd,
    'div': DataPvd.DivDataPvd,
    'mul': DataPvd.MulDataPvd,
    'sub': DataPvd.SubDataPvd,
    'const': DataPvd.ConstDataPvd,
    'offset': DataPvd.OffsetDataPvd,
    'end': DataPvd.EndDataPvd
}

// ldp: {'type': , 'pack': {}}
function checkParas(ldp) {
    if(!validate.isObj(ldp)) return false;
    var name = ldp.type;
    if(!(name in pvdList)) return false;
    return pvdList[name].checkParas(ldp.pack);
}

function pvdID(ldp) {
    return pvdList[ldp.type].pvdID(ldp.pack);
}

function makePvd(ldp, id) {
    return pvdList[ldp.type].makePvd(ldp.pack, id);
}

function makeDataPvd(ldp) {
    if(!checkParas(ldp)) throw new Erro('invalid literal dp.');
    var id = pvdID(ldp);
    if(id in existObj) {
        console.log('old pvd returned, id: ', id);
        return Promise.resolve(existObj[id]);
    }
    return makePvd(ldp, id).then((createObj) => {
        console.log('new pvd created, id: ', id);
        if(ldp.type in cachedPvdList) existObj[id] = createObj;
        return createObj;
    });
}

exports.pvdGenerator = {
    'checkParas': checkParas,
    'pvdID': pvdID,
    'makePvd': makePvd
};
exports.makeDataPvd = makeDataPvd;
