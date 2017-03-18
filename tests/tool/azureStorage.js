
var azure = require('../../src/tool').azureStorage;

/*
azure.getBlobs('./data', 'stockdata').then((r) => {
    console.log('done!');
    console.log(r);
}).catch((err) => {
    console.log('find error');
    console.log(err);
})*/

azure.uploadFiles('../datasrc', 'tmp').catch((err) => console.log(err));
