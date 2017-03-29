
var utility = require('../../src/utility');
var usr = require('../../src/config').azureUsr;
var azure = utility.azureStorage(usr);

azure.deleteContainer('tmp').then((r) => {
    console.log('done');
});
azure.deleteBlob('stockdata', '.DS_Store').then((r) =>console.log(r));
//azure.deleteContainer('stockdata').catch(console.log);
//console.log(utility.azureStorage({}));

/*
blobService.listBlobsSegmented('stockdata', null, function(err, result, response) {

    if(err) console.log('err!', err);
    else {
        result.entries.forEach((entry) => {
            blobService.deleteBlob('stockdata', entry.name, (err, r) => {
                console.log(r);
            });
        })
    }
    blobService.createBlockBlobFromLocalFile('stockdata', 'allstocks.txt', '../../data/allstocks.txt', (err, r) => {
        if(err) console.log('err!', err);
        console.log(r);
    })
    /*
    blobService.getBlobToText('stockdata', '000002.xshe.json', function(err, result, response) {
        if(err) console.log('err', err.code);
        else console.log(result);
    })
})*/
/*
azure.deleteContainer('stockdata').then((r) => {
    console.log(r);
})*/
