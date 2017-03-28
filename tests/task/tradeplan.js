

var simulate = require('../../src/task/consumer/taskLib').simulate;
var getSecID = require('../../src/datasrc/wmcloud').getSecID;
var args = {
    'tradeplanId': 'MA1060',
    'secID': '000002.xshe'
}
var async = require('../../src/utility').async;

getSecID().then((list) => {
    console.log(list);
    var i = 0;
    var N = list.length;

    async.parallel(() => {
        return i < N;
    }, () => {
        var secID = list[i++];
        return simulate.run({
            'tradeplanId': 'MA1060',
            'secID': secID.toLowerCase()
        }).then(() => console.log(secID, ' done!')).catch(console.log);
    }, 10);
}).then(() => console.log('done!')).catch(err => console.log(err));
