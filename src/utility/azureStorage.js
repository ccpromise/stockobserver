
var config = require('../config');
var azure = require('azure-storage');
var blobService = azure.createBlobService(config.azureAccount, config.azurePwd, config.azureHost);

exports.createContainerIfNotExists = function(container, opt) {
    opt = opt || {};
    opt.publicAccessLevel = opt.publicAccessLevel || 'blob';
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(container, opt, (err, r) => {
            if(err) reject(err);
            else resolve(r);
        })
    })
}

exports.getBlobList = function(container) {
    return new Promise((resolve, reject) => {
        var blobs = [];
        var loop = function(curBlobs) {
            blobService.listBlobsSegmented(container, curBlobs, (err, result) => {
                if(err) reject(err);
                else {
                    blobs = blobs.concat(result.entries);
                    if(result.continuationToken !== null) loop(result.continuationToken);
                    else resolve(blobs);
                }
            });
        }
        loop(null);
    });
}

exports.getBlobToText = function (container, blob) {
    return new Promise((resolve, reject) => {
        blobService.getBlobToText(container, blob, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}

exports.getBlobToFile = function (container, blob, filePath) {
    return new Promise((resolve, reject) => {
        blobService.getBlobToLocalFile(container, blob, filePath, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}

exports.createBlobFromText = function (container, blob, content) {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(container, blob, content, (err, result) => { // do we need to set content-type?
            if(err) reject(err);
            else resolve(result);
        })
    })
}

exports.createBlobFromFile = function (container, blob, file) {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromLocalFile(container, blob, file, (err, result) => { // do we need to set content-type?
            if(err) reject(err);
            else resolve(result);
        })
    })
}

exports.deleteContainer = function (container) {
    return new Promise((resolve, reject) => {
        blobService.deleteContainer(container, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
