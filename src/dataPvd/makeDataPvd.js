
var DataPvd = require('./pvdClass');
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
function checkldp(ldp) {
    if(validate.isDataPvd(ldp)) return true;
    if(!(validate.isObj(ldp) && ldp.type in pvdList)) {
        return false;
    }
    return pvdList[ldp.type].checkParams(ldp.pack);
}

function pvdID(ldp) {
    if(!checkldp(ldp)) throw new Error('invalid literal dp');
    if(validate.isDataPvd(ldp)) return ldp.id;
    return pvdList[ldp.type].pvdID(ldp.pack);
}

var pendingObj = {};
function makePvd(ldp) {
    return new Promise((resolve, reject) => {
        try {
            if(validate.isDataPvd(ldp)) resolve(ldp);
            else if(!checkldp(ldp)) reject(new Error('invaid literal dp'));
            else {
                var id = pvdID(ldp);
                if(id in existObj) resolve(existObj[id]);
                else if(id in pendingObj) resolve(pendingObj[id].then((obj) => { return obj; }));
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
}

exports.checkldp= checkldp;
exports.pvdID = pvdID;
exports.makePvd = makePvd;
