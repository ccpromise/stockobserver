
var utility = require('../../../utility')
var validate = utility.validate;
var object = utility.object;
var refReplace = utility.refReplace;
var time = utility.time;
var makePvd = require('../../../dataPvd').makePvd;
var httpReq = require('../../httpReqTmpl');

exports.checkPack = function(args) {
    return validate.isObj(args) && object.numOfKeys(args) === 2 && validate.isStr(args.tradeplanId) && validate.isStr(args.secID);
}

exports.run = function(args) {
    var tradeplanId = args.tradeplanId;
    var secID = args.secID;
    var valueMap = { secID: secID };

    return httpReq('/trade', { filter: { _id: tradeplanId } }, 'findOne').then((r) => {
        //* plan: {_id: , desc, dpInTmpl, dpOutTmpl}
        //console.log('find tradeplan'); //TODO delete for test
        var plan = JSON.parse(r.toString());
        if(plan === null) return Promise.reject(new Error('invalid tradeplanId'));
        var dpInLiteral = refReplace(plan.dpInTmpl, valueMap);
        var dpOutLiteral = refReplace(plan.dpOutTmpl, valueMap);
        var dpIn = makePvd(dpInLiteral); //TODO unhandled promise reject. re-code this part
        var dpOut = makePvd(dpOutLiteral);
        var endData = makePvd({ 'type': 'end', 'pack': secID });
        var lastSimDate = httpReq('/simdate', { filter: { tradeplanId: tradeplanId, secID: secID } }, 'findOne').then((r) => {
            var obj = JSON.parse(r.toString());
            return obj === null ? null : obj.lastSimDate;
        });
        return lastSimDate.then((date) => {
            if(date === time.getDateTs(time.today())) return;
            return Promise.all([dpIn, dpOut, endData]).then((arr) => {
                var dpIn = arr[0];
                var dpOut = arr[1];
                var endData = arr[2];
                var minTs = dpIn.minTs;
                var maxTs = dpIn.maxTs;
                var startTs = date === null ? minTs : dpIn.forwardDateTs(date, 1);

                if(startTs === -1) return;
                return postNewSim(startTs, dpIn, endData, tradeplanId, secID).then(() => {
                    return httpReq('/simulate', { filter: {
                        'tradeplanId': tradeplanId,
                        'secID': secID,
                        'closed': false
                    } }, 'find').then((r) => { return JSON.parse(r.toString()); });
                }).then((sims) => {
                    //console.log('find old sims: ', sims); //TODO delete for test
                    return updateOldSim(sims, dpOut, endData);
                }).then(() => {
                    //console.log('set sim ts: ', maxTs); // TODO delte for test
                    return httpReq('/simdate', { filter: { tradeplanId: tradeplanId, secID: secID }, update: { $set: { lastSimDate: maxTs } } }, 'upsert');
                })
            })
        })
    })
}

function postNewSim(startTs, dpIn, endData, tradeplanId, secID) {
    var ts = startTs;
    var maxTs = dpIn.maxTs;
    var newSim = [];
    while(ts <= maxTs && ts !== -1) {
        if(dpIn.get(ts)) {
            //console.log('should buy at ', ts); //TODO delete for test
            var price = endData.get(ts);
            newSim.push(httpReq('/simulate', { doc: {
                tradeplanId: tradeplanId,
                secID: secID,
                sdts: ts,
                edts: ts,
                hdts: ts,
                ldts: ts,
                sp: price,
                ep: price,
                hp: price,
                lp: price,
                closed: false
            } }, 'insert'));
        }
        //else console.log('not buy at ', ts); //TODO delete for test
        ts = dpIn.forwardDateTs(ts, 1);
    }
    return Promise.all(newSim);
}

function updateOldSim(sims, dpOut, endData){
    if(sims === null || sims.length === 0) return;
    var updates = [];
    var maxTs = dpOut.maxTs;
    sims.forEach((sim) => {
        var ts = dpOut.forwardDateTs(sim.edts, 1);
        var hp = sim.hp;
        var hdts = sim.hdts;
        var lp = sim.lp;
        var ldts = sim.ldts;
        var ep = sim.ep;
        var edts = sim.edts;
        var closed = false;
        while(ts <= maxTs && ts !== -1) {
            ep = endData.get(ts);
            if(ep > hp) {
                hp = ep;
                hdts = ts;
            }
            if(ep < lp) {
                lp = ep;
                ldts = ts;
            }
            if(dpOut.get(ts)) {
                //console.log('should sell at ', ts); //TODO delete for test
                edts = ts;
                closed = true;
                break;
            }
            //console.log('not sell at ', ts); //TODO delete for test
            ts = dpOut.forwardDateTs(ts, 1);
        }
        if(closed === false) {
            edts = maxTs;
        }
        updates.push({
            'filter': { _id: sim._id },
            'update': { $set: { edts: edts, hdts: hdts, ldts: ldts, ep: ep, hp: hp, lp: lp, closed: closed } }
        });
    });
    //console.log('update simulate: ', JSON.stringify(updates)); // TODO delete for test
    return httpReq('/simulate', updates, 'updateMany');
}
