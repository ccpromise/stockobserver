var wmcloud = require('../../../src/datasrc/wmcloud');
var time = require('../../../src/utility').time;
var fs = require('fs');


wmcloud.getHistoryData('000001.XSHE').then((data) => {
    var res = {};
    console.log(data);
    for(date in data) {
        console.log(date);
        res[time.getDateTs(date)] = data[date];
    }
    console.log(res);
    fs.writeFile('./data.txt', JSON.stringify(res), (err) => {
        console.log('done!');
    })
});
//Promise.all([
    // wmcloud.getHistoryData("000001.XSHE")
    //     .then((data) => {
    //         console.log(data);
    //     }),
    //wmcloud.getTradeDateData("20150115").then((data) => console.log(data))])
    //.then(() => console.log('done'))
    //.catch(err => console.error(err));
