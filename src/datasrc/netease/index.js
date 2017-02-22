var http = require('../../utility').http;
var opt = {
    host: 'quotes.money.163.com',
    path: '/hs/service/diyrank.php',
    query: 'host=http%3A%2F%2Fquotes.money.163.com%2Fhs%2Fservice%2Fdiyrank.php&page=0&query=STYPE%3AEQA&fields=NO%2CSYMBOL%2CNAME%2CPRICE%2CPERCENT%2CUPDOWN%2CFIVE_MINUTE%2COPEN%2CYESTCLOSE%2CHIGH%2CLOW%2CVOLUME%2CTURNOVER%2CHS%2CLB%2CWB%2CZF%2CPE%2CMCAP%2CTCAP%2CMFSUM%2CMFRATIO.MFRATIO2%2CMFRATIO.MFRATIO10%2CSNAME%2CCODE%2CANNOUNMT%2CUVSNEWS&count=4000&type=query',
    headers: {
        host: 'quotes.money.163.com'
    }
}

exports.getStockData = function() {
    return new Promise((resolve, reject) => {
        http.request(opt).then((obj) => {
            var data = JSON.parse(obj);
            var time = data.time;
            var stock = {};
            data.list.forEach((item) => {
                var code = item.CODE;
                stock[code] = {
                    'start': item.OPEN,
                    'end': item.PRICE,
                    'high': item.HIGH,
                    'low': item.LOW,
                    'exchange': item.HS,
                    'volumn': item.VOLUME,
                    'preclose': item.YESTCLOSE,
                    'time': time
                };
            });
            resolve({
                stock: stock,
                count: data.list.length
            });
        }).catch(reject);
    });
};//().then((data) => { console.log(data);}).catch(err => console.log(err));
