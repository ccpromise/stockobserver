var http = require('../../utility').http;
var access_token = require('../../config').access_token;
var assert = require('assert');
var opt = {
    protocol: 'https',
    host: 'api.wmcloud.com',
    path: '/data/v1/api/market/getMktEqud.json',
    headers: {
        'Authorization': 'Bearer ' + access_token,
    }
}

exports.getMktEquad = function(query) {
    return new Promise((resolve, reject) => {
        opt.query = 'field='+query.field+'&beginDate='+query.beginDate+'&endDate='+query.endDate+'&secID='+query.secID+'&ticker='+query.ticker+'&tradeDate='+query.tradeDate;
        http.request(opt).then((data) => {
            //console.log(data.toString());
            data = JSON.parse(data.toString());
            try {
                assert.equal(data.retCode, 1);
                resolve(data);
            }
            catch(err) {
                reject(data.retMsg);
            }
        }).catch((err) => reject('data cannot be parsed by JSON!'));
    });
};
