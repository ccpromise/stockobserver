
var getSecID = require('../../../src/node_modules/datasrc').wmcloud.getSecID;

getSecID().then((r) => {
    console.log(r.length);
});
