var http = require('../utility').http;
var stockListUrl = require('../config').stockListUrl;

module.exports = function () {
    //return http.request(stockListUrl).then((data) => {
    //    return data.toString().split(';');
    //});
    return Promise.resolve(['000001.XSHE', '600600.XSHG', '000002.XSHE']);
}
