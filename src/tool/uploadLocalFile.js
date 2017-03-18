
var fs = require('fs');
var utility = require('../utility');
var path = require('path');
var file = utility.file;
var azure = utility.azureStorage;

exports.uploadFiles = function(path, container) {
    if(fs.stat(path).isDirectory()) {
        return file.readDirectory(path).then((filenames) => {
            var promises = filenames.map((filename) => {
                return azure.createBlobFromFile(container, filename, path.join(path, filename));
            });
            return Promise.all(promises);
        });
    }
    else {
        return azure.createBlobFromFile(container, path, path);
    }
}

// download blobs from a container to a directory
exports.getBlobs = function(path, container) {
    azure.getBlobList(container).then((bolbnames) => {
        var promises = bolbnames.map((bolbname) => {
            return azure.getBlobToFile(container, bolbname, path.join(path, bolbname));
        });
        return Promise.all(promises);
    })
}
