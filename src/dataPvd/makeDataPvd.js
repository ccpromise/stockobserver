
/**
 * generate data pvd instance according to a literal description like { type: 'end', pack: '000001.xshe'}
 * each data pvd class provides interface: {
 * checkParams: function(ldp) {},
 * pvdID: function(ldp) {},
 * makePvd: function(ldp) {},
 * }
 * this module is to assign checkParams/pvdID/makePvd tasks according to ldp's type,
 * and to make cache for compute intensive pvd.
 * usage sample:
 * var pvdPromise = makeDataPvd({ type: 'ma', pack: { pvd: { type: 'end', pack: '000001.xshe'}, N: 10}})
 * generate a moving average data provider, which use end-data of stock '000001.xshe' and average window size is 10.
 */
const utility = require('../utility');
const validate = utility.validate;
const Cache = utility.Cache;
const cacheCapacity = require('../config').cacheCapacity;
const cachePvdList = {'ma': true, 'std': true, 'boll': true, 'ema': true, 'macd': true}
const DataPvdLib = require('./pvdClass');
const pvdMap = {
    'ma': DataPvdLib.MADataPvd,
    'std': DataPvdLib.StdDataPvd,
    'boll': DataPvdLib.BollDataPvd,
    'ema': DataPvdLib.EMADataPvd,
    'macd': DataPvdLib.MACDDataPvd,
    'add': DataPvdLib.AddDataPvd,
    'div': DataPvdLib.DivDataPvd,
    'mul': DataPvdLib.MulDataPvd,
    'sub': DataPvdLib.SubDataPvd,
    'const': DataPvdLib.ConstDataPvd,
    'offset': DataPvdLib.OffsetDataPvd,
    'end': DataPvdLib.EndDataPvd,
    'and': DataPvdLib.AndDataPvd,
    'gt': DataPvdLib.GtDataPvd
}

/**
 * check if liter dp is valid:
 * ldp is an instance of base class DataPvd,
 * or ldp is in { type: , pack: } format
 */
function checkldp(ldp) {
    if(ldp instanceof DataPvdLib.DataPvd) return true;
    if(!(validate.isObj(ldp) && ldp.type in pvdMap)) {
        return false;
    }
    return pvdMap[ldp.type].checkParams(ldp.pack);
}

/**
 * generate id using liter dp
 */
function pvdID(ldp) {
    if(!checkldp(ldp)) throw new Error('invalid literal dp');
    if(ldp instanceof DataPvdLib.DataPvd) return ldp.id;
    return pvdMap[ldp.type].pvdID(ldp.pack);
}

/**
 * generate date pvd according to ldp.
 */
var pvdCache = new Cache(cacheCapacity, true);
function makePvd(ldp) {
    return Promise.resolve().then(() => {
        if(ldp instanceof DataPvdLib.DataPvd) return ldp;
        if(!checkldp(ldp)) throw new Error('invalid literal dp');
        var id = pvdID(ldp);
        if(pvdCache.has(id)) return pvdCache.get(id);
        var promise = pvdMap[ldp.type].makePvd(ldp.pack, id);
        if(ldp.type in cachePvdList) {
            pvdCache.set(id, promise);
            var refPvdIDs = pvdMap[ldp.type].refPvdIDs(id);
            return promise.then((dp) => {
                //* if this pvd refers to other cache which are also in cache, then bind a reference between them.
                //* when other cache is removed, this pvd cache should remove too.
                for(let refID of refPvdIDs) {
                    if(pvdCache.has(refID)) {
                        pvdCache.addReference(id, refID);
                    }
                }
                return dp;
            })
        }
        return promise;
    })
}

exports.checkldp= checkldp;
exports.pvdID = pvdID;
exports.makePvd = makePvd;
