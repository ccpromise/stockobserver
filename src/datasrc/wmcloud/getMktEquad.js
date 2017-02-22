var http = require('../../utility').http;
var access_token = require('../../config').access_token;
console.log(access_token);
var opt = {
    protocol: 'https',
    host: 'api.wmcloud.com',
    path: '/data/v1/api/market/getMktEqud.json',
    header: 'Authorization: Bearer <' + access_token + '>'
}

exports.getMktEqud = function(query) {
    return new Promise((resolve, reject) => {
        opt.query = query;
        http.request(opt).then((data) => {
            data = JSON.parse(data);
            console.log(data);
            resolve(data);
        }).catch(reject);
    });
}('field=&beginDate=&endDate=&secID=000001.XSHE&ticker=&tradeDate=20150513').catch(err => console.log(err));
