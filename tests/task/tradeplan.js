

var simulate = require('../../src/task/consumer/taskLib').simulate;
var args = {
    'tradeplanId': 'MA1060',
    'secID': '000001.xshe'
}

simulate.run(args).catch(console.log);
