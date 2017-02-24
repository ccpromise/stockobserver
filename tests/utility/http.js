
var http = require('../../src/utility/').http;

var opt = {
    host: 'www.baidu.com',
}

http.request(opt).then((data) => { console.log(data)}).catch(err => console.log(err));
