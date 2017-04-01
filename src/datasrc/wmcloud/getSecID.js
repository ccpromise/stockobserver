
var request = require('../../utility').request;
var access_token = require('../../config').access_token;

var opt = {
    host: 'api.wmcloud.com',
    path: '/data/v1/api/master/getSecID.csv',
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
        var data = content.toString().split('\n').slice(1).map((str) => str.split(','));
        return data.filter((item) => item[1] === '"L"' && (item[2] === '"XSHG"' || item[2] === '"XSHE"')).map((item) => item[0].toLowerCase().slice(1, -1));
    });
}
