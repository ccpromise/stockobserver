
var utility = require('../../src/node_modules/utility');
const async = utility.async;

async.some([() => Promise.resolve(true), () => Promise.resolve(false)]).then((r) => {
    console.log(r);
})
