
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
        /** content.toString():
         * secID,listStatusCD,exchangeCD
         * "000001.XSHE","L","XSHE"
         * "000002.XSHE","L","XSHE"
         * "000003.XSHE","DE","XSHE"
         * ....
         */
        var r = JSON.parse(content.toString());
        if(r.retCode !== 1) throw new Error(r.retMsg);
        return r.data.filter((stock) => stock.listStatusCD === 'L' && (stock.exchangeCD === 'XSHE' || stock.exchangeCD === 'XSHG')).map((stock) => {
            return stock.secID.toLowerCase();
        });
    });
}
