
var http = require('../../utility').http;
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

/*module.exports = function() {
    return http.request(opt).then((data) => {
        console.log(JSON.parse(data.toString()));
    }).catch((err) => console.log(err));
}*/

var azure = require('../../utility').azureStorage;
var container = require('../../config').stockdataContainer;

module.exports = function() {
    return azure.getBlobToText(container, 'allstocks.txt').then((r) => {
        return r.split(';');
    });
}
