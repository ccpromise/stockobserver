
var config = require('../../src/node_modules/config');
var utility = require('../../src/node_modules/utility');
var usr = require('../../src/node_modules/config').azureUsr;
var azure = utility.azureStorage(usr);
var fs = require('fs');
var path = require('path');

azure.getBlobToFile(config.stockdataContainer, '000001.xshe.json', path.join(config.stockDataDir, '/000001.xshe.json')).catch((err) => {
    console.log('err: ', err);
})

// azure.getBlobToFile('stockdata', '000001.xshe.json', './tmp/').catch((err) => {
//     console.log('find err: ', err);
// })
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
