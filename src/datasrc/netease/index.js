var http = require('../../utility').http;
var parseObjArr = require('../../utility').parse.parseObjArr;
var fields = ['CODE', 'OPEN', 'PRICE', 'HIGH', 'LOW', 'HS', 'VOLUME', 'YESTCLOSE'];
var count = 4000;
var opt = {
    host: 'quotes.money.163.com',
    path: '/hs/service/diyrank.php',
    query: 'page=0&query=STYPE:EQA&fields=' + fields.join(',') + '&count=' + count + '&type=query',
}

exports.getStockData = function () {
    return new Promise((resolve, reject) => {
        http.request(opt).then((obj) => {
            var data = JSON.parse(obj.toString());
            var stockData = parseObjArr(data.list, fields, ['start', 'end', 'high', 'low', 'exchange', 'volumn', 'preclose']);
            resolve({
                stock: stockData,
                time: data.time,
                count: data.list.length
            });
        }).catch(reject);
    });
}().then((data) => { console.log(data); }).catch(err => console.log(err));
