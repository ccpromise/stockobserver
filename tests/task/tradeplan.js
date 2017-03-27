

var simulate = require('../../src/task/consumer/taskLib').simulate;
var getSecID = require('../../src/datasrc/wmcloud').getSecID;
var args = {
    'tradeplanId': 'MA1060',
    'secID': '000002.xshe'
}

getSecID().then((list) => {
    console.log(list);
    return Promise.all(list.map((secID) => {
        return simulate.run({
            'tradeplanId': 'MA1060',
            'secID': secID.toLowerCase()
        }).then(() => console.log(secID, ' done!'));
    }));
}).then(() => console.log('done!')).catch(err => console.log(err));
