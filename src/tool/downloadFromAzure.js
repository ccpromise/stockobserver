
var utility = require('../utility');
var path = require('path');
var azure = utility.azureStorage;
var async = utility.async;
var parallelN = 10;

var downloadFromAzure = function(localPath, container) {
    return azure.getBlobList(container).then((result) => {
        var bolbnames = result.map(r => r.name);
        var N = bolbnames.length;
        var i = 0;

        return async.parallel(() => {
            return i < N;
        }, () => {
            var j = i++;
            return azure.getBlobToFile(container, bolbnames[j], path.join(localPath, bolbnames[j])).then(() => {
                console.log('succeed to download ', bolbnames[j]);
            }, (err) => {
                console.log('fail to download ', bolbnames[j], '. err: ', err);
            });
        }, parallelN);
    });
}

downloadFromAzure(process.argv[2], process.argv[3]).catch((err) => console.log(err));
