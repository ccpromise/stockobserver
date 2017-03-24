
var utility = require('../../../utility')
var validate = utility.validate;
var object = utility.numOfKeys;
var refReplace = utility.refReplace;
var time = utility.time;
var http = utility.http;
var config = require('../../../config');
var host = config.dispatcherHost;
var port = config.dispatcherPort;
var makePvd = require('../../../dataPvd').makePvd;

exports.checkArgs = function(args) {
    return validate.isObj(args) && object.numOfKeys(args) === 2 && validate.isStr(args.tradeplanId) && validate.isStr(args.secID);
}

exports.run = function(args) {
    var tradeplanId = args.tradeplanId;
    var secID = args.secID;
    var valueMap = { secID: secID };

    return postToTradeplan([{ tradeplanId: tradeplanId }], 'findOne').then((r) => {
        // plan: {_id: , desc, dpInTmpl, dpOutTmpl}
        var plan = JSON.parse(r.toString());
        if(plan === null) return Promise.reject(new Error('invalid tradeplanId'));
        var dpInLiteral = refReplace(plan.dpInTmpl, valueMap);
        var dpOutLiteral = refReplace(plan.dpOutTmpl, valueMap);
        var dpIn = makePvd(dpInLiteral);
        var dpOut = makePvd(dpOutLiteral);
        var endData = makePvd({ 'type': 'end', 'pack': secID });
        var todayTs = time.getDateTs(time.yesterday()); // test
        return Promise.all([dpIn, dpOut, endData]).then((arr) => {
            var dpIn = arr[0];
            var dpOut = arr[1];
            var endData = arr[2];

            if(!endData.hasDef(todayTs)) return Promise.reject(new Error('stock data is not updated to today.'));
            if(dpIn.get(todayTs)) {
                console.log(secID, ' should buy at ', time.format(time.today(), 'YYYYMMDD'));
                var todayPrice = endData.get(todayTs);
                var post = postToSimulate([{
                    tradeplanId: tradeplanId,
                    secID: secID,
                    sdts: todayTs,
                    edts: todayTs,
                    hdts: todayTs,
                    ldts: todayTs,
                    sp: todayPrice,
                    ep: todayPrice,
                    hp: todayPrice,
                    lp: todayPrice,
                    closed: false
                }], 'insert');
            }
            var get = postToSimulate([{ 'tradeplanId': tradeplanId, 'secID': secID, 'closed': false }], 'find').then((docs) => {
                // doc: {_id, tradeplanId, secID, sdts, edts, hdts, ldts, sp, ep, hp, lp, closed}
                docs = JSON.parse(docs.toString());
                if(docs === null) {
                    console.log('server error when getting open trade');
                    return;
                }
                if(docs.length === 0) {
                    console.log('no open trade of ', secID, ' in ', tradeplanId);
                    return;
                }
                console.log('found old open trade: ', docs);
                var updates = [];
                docs.forEach((doc) => {
                    var ts = endData.forwardDateTs(doc.edts, 1);
                    var hp = doc.hp;
                    var hdts = doc.hdts;
                    var lp = doc.lp;
                    var ldts = doc.ldts;
                    var ep = doc.ep;
                    var edts = doc.edts;
                    var closed = false;
                    while(ts <= todayTs && ts !== -1) {
                        var endPrice = endData.get(ts);
                        if(endPrice > hp) {
                            hp = endPrice;
                            hdts = ts;
                        }
                        if(endPrice < lp) {
                            lp = endPrice;
                            ldts = ts;
                        }
                        if(dpOut.get(ts)) {
                            edts = ts;
                            ep = endPrice;
                            closed = true;
                            break;
                        }
                        ts = endData.forwardDateTs(ts, 1);
                    }
                    if(closed === false) {
                        edts = todayTs;
                        ep = endData.get(todayTs);
                    }
                    console.log('trade updated: ', '\nedts: ', edts, '\nhdts: ', hdts, '\nldts: ', ldts, '\nep: ', ep, '\nhp: ', hp, '\nlp: ', lp, '\nclosed: ', closed)
                    updates.push({
                        'filter': { _id: doc._id },
                        'update': { $set: { edts: edts, hdts: hdts, ldts: ldts, ep: ep, hp: hp, lp: lp, closed: closed } }
                    })
                });
                return postToSimulate([updates], 'updateMany'); // to change
            });
            return Promise.all([post, get]);
        });
    }).then(() =>
        console.log('simulate trade finished:', '\nsecID: ', secID, '\ntradeplanId: ', tradeplanId, '\ndate: ', time.format(time.today(), 'YYYYMMDD'))
    ).catch(console.log);
}

var postToTradeplan = function(args, verb) {
    var opt = {
        host: host,
        port: port,
        path: 'simulateTrade/trade',
        method: 'POST',
        data: JSON.stringify(args),
        headers: {
            'content-type': 'application/json',
            verb: verb
        }
    };
    return http.request(opt);
}

var postToSimulate = function(args, verb) {
    var opt = {
        host: host,
        port: port,
        path: 'simulateTrade/simulate',
        method: 'POST',
        data: JSON.stringify(args),
        headers: {
            'content-type': 'application/json',
            verb: verb
        }
    }
    return http.request(opt);
}
