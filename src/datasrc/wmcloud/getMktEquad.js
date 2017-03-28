var utility = require('../../utility');
var access_token = require('../../config').access_token;

var opt = {
    host: 'api.wmcloud.com',
    path: '/data/v1/api/market/getMktEqud.json',
    headers: {
        'Authorization': 'Bearer ' + access_token,
    },
    useHttps: true
}

exports.getMktEquad = function(query) {
    return new Promise((resolve, reject) => {
        try {
            var option = utility.object.clone(opt);
            option.query = 'field='+query.field+'&beginDate='+query.beginDate+'&endDate='+query.endDate+'&secID='+query.secID+'&ticker='+query.ticker+'&tradeDate='+query.tradeDate;
            //wmcloud is an https api
            utility.http.request(option).then((data) => {
                try {
                    data = JSON.parse(data.toString());
                }
                catch (err) {
                    console.log('JSON parse error 2');
                    reject(err);
                    return;
                }
                resolve(data);
            }).catch(reject);
        }
        catch(err) {
            reject(err);
        }
    });
};
