
const utility = require('../../../utility')
const validate = utility.validate;
const object = utility.object;
const refReplace = utility.refReplace;
const time = utility.time;
const makePvd = require('../../../dataPvd').makePvd;
const httpReq = require('../../httpReqTmpl');

exports.checkPack = function(args) {
    return validate.isObj(args) && object.numOfKeys(args) === 2 && validate.isStr(args.tradeplanId) && validate.isStr(args.secID);
}

exports.run = function(args) {
    var tradeplanId = args.tradeplanId;
    var secID = args.secID;
    var valueMap = { secID: secID };

    return httpReq('/trade', { filter: { _id: tradeplanId } }, 'findOne').then((r) => {
        var plan = JSON.parse(r.toString());
        if(plan === null) return Promise.reject(new Error('invalid tradeplanId'));

        var dpInLiteral = refReplace(plan.dpInTmpl, valueMap);
        var dpOutLiteral = refReplace(plan.dpOutTmpl, valueMap);
        var dpIn = makePvd(dpInLiteral);
        var dpOut = makePvd(dpOutLiteral);
        var end = makePvd({ 'type': 'end', 'pack': secID });

        return Promise.all([dpIn, dpOut, end]).then((dpArr) => {
            var dpIn = dpArr[0];
            var dpOut = dpArr[1];
            var end = dpArr[2];

            return httpReq('/simdate', { filter: { tradeplanId: tradeplanId, secID: secID } }, 'findOne').then((r) => {
                var doc = JSON.parse(r.toString());
                return doc === null ? null : doc.lastSimTs;
            }).then((lastSimTs) => { //* find if there are new in-trades since lastSimTs
                var startTs = lastSimTs === null ? dpIn.minTs : dpIn.forwardDateTs(lastSimTs, 1);

                if(startTs === -1) return;
                var inDays = findInDays(startTs, dpIn);
                var newTradeArr = inDays.map((ts) => {
                    var inPrice = end.get(ts);
                    return {
                        tradeplanId: tradeplanId,
                        secID: secID,
                        sdts: ts,
                        edts: ts,
                        hdts: ts,
                        ldts: ts,
                        sp: inPrice,
                        ep: inPrice,
                        hp: inPrice,
                        lp: inPrice,
                        closed: false
                    }
                });
                return newTradeArr.length === 0 ? Promise.resolve() : httpReq('/simulate', { docs: newTradeArr }, 'insertMany');
            }).then(() => { //* update all the open trades
                return httpReq('/simulate', { filter: { 'tradeplanId': tradeplanId, 'secID': secID, 'closed': false } }, 'find').then((r) => {
                    var openTradeArr = JSON.parse(r.toString());
                    var updatedTradeArr = updateOpenTrade(openTradeArr, dpOut, end);
                    var docs = updatedTradeArr.map((trade) => {
                        return {
                            filter: { _id: trade._id },
                            update: { $set: { edts: trade.edts, hdts: trade.hdts, ldts: trade.ldts, ep: trade.ep, hp: trade.hp, lp: trade.lp, closed: trade.closed } }
                        }
                    });
                    return httpReq('/simulate', docs, 'updateMany');
                })
            }).then(() => { //* udpate lastSimTs
                return httpReq('/simdate', { filter: { tradeplanId: tradeplanId, secID: secID }, update: { $set: { lastSimDate: dpIn.maxTs } } }, 'upsert');
            });
        })
    })
}

function findInDays(startTs, dpIn) {
    var ts = startTs;
    var inDays = [];

    while(ts !== -1) {
        if(dpIn.get(ts)) inDays.push(ts);
        ts = dpIn.forwardDateTs(ts, 1);
    }
    return inDays;
}

function updateOpenTrade(tradeArr, dpOut, end) {
    tradeArr.forEach((trade) => {
        var ts = dpOut.forwardDateTs(trade.edts, 1);
        while(ts !== -1) {
            var price = end.get(ts);
            if(price > trade.hp) {
                trade.hp = price;
                trade.hdts = ts;
            }
            if(price < trade.lp) {
                trade.lp = price;
                trade.ldts = ts;
            }
            if(dpOut.get(ts)) {
                trade.ep = price;
                trade.edts = ts;
                trade.closed = true;
                break;
            }
            ts = dpOut.forwardDateTs(ts, 1);
        }
    });
    return tradeArr;
}
