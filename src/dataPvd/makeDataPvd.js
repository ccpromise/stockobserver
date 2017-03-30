
var DataPvds = require('./pvdClass');
var utility = require('../utility');
var validate = utility.validate;
var existObj = {};
var cachedPvdList = {'ma': true, 'std': true, 'boll': true, 'ema': true, 'macd': true}
var pvdList = {
    'ma': DataPvds.MADataPvd,
    'std': DataPvds.StdDataPvd,
    'boll': DataPvds.BollDataPvd,
    'ema': DataPvds.EMADataPvd,
    'macd': DataPvds.MACDDataPvd,
    'add': DataPvds.AddDataPvd,
    'div': DataPvds.DivDataPvd,
    'mul': DataPvds.MulDataPvd,
    'sub': DataPvds.SubDataPvd,
    'const': DataPvds.ConstDataPvd,
    'offset': DataPvds.OffsetDataPvd,
    'end': DataPvds.EndDataPvd,
    'and': DataPvds.AndDataPvd,
    'gt': DataPvds.GtDataPvd
}

// ldp: {'type': , 'pack': {}}
function checkldp(ldp) {
    if(ldp instanceof DataPvds.DataPvd) return true;
    if(!(validate.isObj(ldp) && ldp.type in pvdList)) {
        return false;
    }
    return pvdList[ldp.type].checkParams(ldp.pack);
}

function pvdID(ldp) {
    if(!checkldp(ldp)) throw new Error('invalid literal dp');
    if(ldp instanceof DataPvds.DataPvd) return ldp.id;
    return pvdList[ldp.type].pvdID(ldp.pack);
}

var pvdPromiseMap = {};
function makePvd(ldp) {
    return Promise.resolve().then(() => {
        if(ldp instanceof DataPvds.DataPvd) return ldp;
        if(!checkldp(ldp)) throw new Error('invalid literal dp');
        var id = pvdID(ldp);
        if(id in pvdPromiseMap) return pvdPromiseMap[id];
        var promise = pvdList[ldp.type].makePvd(ldp.pack, id);
        if(ldp.type in cachedPvdList) pvdPromiseMap[id] = promise;
        return promise;
    })
}
    /*
    return new Promise((resolve, reject) => {
        try {
            if(validate.isDataPvd(ldp)) resolve(ldp);
            else if(!checkldp(ldp)) reject(new Error('invaid literal dp'));
            else {
                var id = pvdID(ldp);
                if(id in existObj) resolve(existObj[id]);
                else if(id in pendingObj) resolve(pendingObj[id]);
                else {
                    var promise = pvdList[ldp.type].makePvd(ldp.pack, id);
                    promise.then((createdObj) => {
                        if(ldp.type in cachedPvdList) existObj[id] = createdObj;
                        delete pendingObj[id];
                        resolve(createdObj);
                    }).catch(reject);
                    pendingObj[id] = promise;
                }
            }
        }
        catch(err) {
            reject(err);
        }
    });
    */


exports.checkldp= checkldp;
exports.pvdID = pvdID;
exports.makePvd = makePvd;
