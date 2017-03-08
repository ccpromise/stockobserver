var http = require('../utility').http;
var stockListUrl = require('../config').stockListUrl;

module.exports = function () {
    //return http.request(stockListUrl).then((data) => {
    //    return data.toString().split('','')','
    //})','
    return Promise.resolve(['000001.XSHE', '600600.XSHG', '000002.XSHE']);
    //,'000004.XSHE','000005.XSHE','000007.XSHE','000008.XSHE','000009.XSHE','000010.XSHE','000011.XSHE','000012.XSHE','000014.XSHE','000016.XSHE','000017.XSHE']);
}
