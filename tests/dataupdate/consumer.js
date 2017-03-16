
var consumer = require('../../src/dataupdate/consumer');

var x = new consumer();
x.getTask().catch((err) => {
    console.log('find error');
    console.log(err);
})
