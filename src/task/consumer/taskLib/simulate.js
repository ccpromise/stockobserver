
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

    return getTradeplan(tradeplanId).then((r) => {
        // plan: {_id: , desc, dpInTmpl, dpOutTmpl}
        var plan = JSON.parse(r.toString());
        if(plan === null) return Promise.reject('invalid tradeplanId');
        var dpInLiteral = refReplace(plan.dpInTmpl, valueMap);
        var dpOutLiteral = refReplace(plan.dpOutTmpl, valueMap);
        var dpIn = makePvd(dpInLiteral);
        var dpOut = makePvd(dpOutLiteral);
        var endData = makePvd({ 'type': 'end', 'pack': secID });
        var todayTs = time.getTs(time.today());
        return Promise.all([dpIn, dpOut, endData]).then((arr) => {
            var dpIn = arr[0];
            var dpOut = arr[1];
            var endData = arr[2];

            if(!endData.hasDef(todayTs)) return Promise.reject('stock data is not updated to today.');
            if(dpIn.get(todayTs)) {
                console.log(secID, ' should buy at ', time.format(time.today(), 'YYYYMMDD'));
                var todayPrice = endData.get(todayTs);
                var post = postToSimulate([{
                    _id: tradeplanId + secID + todayTs,
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
                }]);
            }
            var get = getOpenTrade({ 'tradeplanId': tradeplanId, 'secID': secID }).then((docs) => {
                // doc: {_id, tradeplanId, secID, sdts, edts, hdts, ldts, sp, ep, hp, lp, closed}
                docs = JSON.parse(docs.toString());
                var sell = dpOut.get(todayTs);
                var ep = endData.get(todayTs);
                if(docs.length === 0) return;
                docs.forEach((doc) => {
                    var ts = endData.forwardDateTs(doc.edts, 1);
                    while(ts <= todayTs) {
                        var endPrice = endData.get(ts);
                        if(endPrice > doc.hp) {
                            doc.hp = endPrice;
                            doc.hdts = ts;
                        }
                        if(endPrice < doc.lp) {
                            doc.lp = endPrice;
                            doc.ldts = ts;
                        }
                        ts = endData.forwardDateTs(ts, 1);
                    }
                    doc.edts = todayTs;
                    doc.ep = ep
                    if(sell) {
                        doc.closed = true;
                    }
                });
                console.log(secID, ' should sell at ', time.format(time.today(), 'YYYYMMDD'));
                return postToSimulate(docs);
            });
            return Promise.all([post, get]);
        });
    }).then(() =>
        console.log('simulate trade finished:', '\nsecID: ', secID, '\ntradeplanId: ', tradeplanId, '\ndate: ', time.format(time.today(), 'YYYYMMDD'))
    ).catch(console.log);
}

var getTradeplan = function(tradeplanId) {
    var opt = {
        host: host,
        port: port,
        path: 'simulateTrade/tradeplan',
        query: '_id=' + tradeplanId,
    };
    return http.request(opt);
}

var postToSimulate = function(trades) {
    var opt = {
        host: host,
        port: port,
        path: 'simulateTrade/updateTrade',
        method: 'POST',
        data: JSON.stringify(trades),
        headers: {
            'content-type': 'application/json'
        }
    }
    return http.request(opt);
}

var getOpenTrade = function(filter) {
    var opt = {
        host: host,
        port: port,
        path: 'simulateTrade/getOpenTrade',
        query: 'tradeplanId=' + filter.tradeplanId + '&secID=' + filter.secID + '&closed=false',
    }
    return http.request(opt);
}
