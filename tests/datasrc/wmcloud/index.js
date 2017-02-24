var wmcloud = require('../../../src/datasrc/wmcloud');
var time = require('../../../src/utility').time;
var fs = require('fs');

wmcloud.getHistoryData("000001.XSHE")
.then((data) => {
    console.log(data);
});

wmcloud.getTradeDateData("20150115").then((data) => console.log(data));
