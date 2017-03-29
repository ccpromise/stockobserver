
var request = require('../../utility').request;
var access_token = require('../../config').access_token;

var opt = {
    host: 'api.wmcloud.com',
    path: '/data/v1/api/master/getSecID.json',
    query: 'assetClass=E&field=secID,listStatusCD,exchangeCD',
    headers: {
        'Authorization': 'Bearer ' + access_token,
    },
    useHttps: true
}

module.exports = function() {
    return request(opt).then((content) => {
        var data = JSON.parse(content.toString());
        if(data.retCode !== 1) throw new Error(data.retMsg);
        return data.data.filter((stock) => stock.listStatusCD === 'L' && (stock.exchangeCD === 'XSHG' ||stock.exchangeCD === 'XSHE')).map((stock) => stock.secID);
    });
}
