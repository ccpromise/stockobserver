
var utility = require('../../utility');
var access_token = require('../../config').access_token;

var opt = {
    host: 'api.wmcloud.com',
    path: '/api/master/getSecID.json',
    query: 'assetClass=E&field=secID,listStatusCD',
    headers: {
        'Authorization': 'Bearer ' + access_token,
    },
    useHttps: true
}

module.exports = function() {
    /*return utility.http.request(opt).then((data) => {
        console.log(JSON.parse(data.toString()));
    }).catch((err) => console.log(err));*/
    return Promise.resolve(['000001.XSHE', '000002.XSHE', '000006.XSHE']);
}
