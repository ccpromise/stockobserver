var request = require('../../utility').request;
var fields = ['CODE', 'OPEN', 'PRICE', 'HIGH', 'LOW', 'HS', 'VOLUME', 'YESTCLOSE'];
var property = ['start', 'end', 'high', 'low', 'exchange', 'volumn', 'preclose']
var count = 4000;
var opt = {
    host: 'quotes.money.163.com',
    path: '/hs/service/diyrank.php',
    query: 'page=0&query=STYPE:EQA&fields=' + fields.join(',') + '&count=' + count + '&type=query',
}

exports.getStockData = function () {
    return new Promise((resolve, reject) => {
        request(opt).then((obj) => {
            var res = JSON.parse(obj.toString());
            var stock = res.list.reduce((pre, cur) => {
                pre[cur['CODE']] = {};
                for(var i = 0; i < 7; i++)
                    pre[cur['CODE']][property[i]] = cur[fields[i+1]];
                return pre;
            }, {});
            resolve({
                stock: stock,
                time: res.time,
                count: res.list.length
            });
        }).catch(reject);
    });
};
