var http = require('../../utility').http;
var access_token = require('../../config').access_token;
var opt = {
    protocol: 'https',
    host: 'api.wmcloud.com',
    path: '/data/v1/api/market/getMktEqud.json',
    headers: {
        'Authorization': 'Bearer bf1e63e10264f88d3d44541d4057e00981ced9e6042c19ce02c0b738f471c747',
        host: 'api.wmcloud.com'
    }
}

exports.getMktEquad = function(query) {
    return new Promise((resolve, reject) => {
        opt.query = 'field='+query.field+'&beginDate='+query.beginDate+'&endDate='+query.endDate+'&secID='+query.secID+'&ticker='+query.ticker+'&tradeDate='+query.tradeDate;
        http.request(opt).then((data) => {
            data = JSON.parse(data);
            if(data.retCode !== 1) reject(data.retMsg);
            else resolve(data);
        }).catch(reject);
    });
};
