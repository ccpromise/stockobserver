var http = require('../../utility').http;
var access_token = require('../../config').access_token;
var assert = require('assert');
var clone = require('../../utility').clone;
var opt = {
    protocol: 'https:',
    host: 'api.wmcloud.com',
    path: '/data/v1/api/market/getMktEqud.json',
    headers: {
        'Authorization': 'Bearer ' + access_token,
    }
}

exports.getMktEquad = function(query) {
    return new Promise((resolve, reject) => {
        var option = clone(opt);
        option.query = 'field='+query.field+'&beginDate='+query.beginDate+'&endDate='+query.endDate+'&secID='+query.secID+'&ticker='+query.ticker+'&tradeDate='+query.tradeDate;
        http.request(option).then((data) => {
            data = JSON.parse(data.toString());
            resolve(data);
        }).catch(reject);
    });
};
