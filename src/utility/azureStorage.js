
const validate = require('./validate');
const azure = require('azure-storage');
const async = require('./async');

module.exports = function(azureUsr) {
    var blobService = azure.createBlobService(azureUsr.account, azureUsr.pwd, azureUsr.host);
    var exports = {};

    /**
     * create a container if not exists.
     * by default, set publicAccessLevel as 'blob'.
    */
    exports.createContainerIfNotExists = function(container, opt) {
        opt = opt || {};
        opt.publicAccessLevel = opt.publicAccessLevel || 'blob';
        return new Promise((resolve, reject) => {
            blobService.createContainerIfNotExists(container, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    }

    /**
     * get blob name list of a container.
     */
    exports.getBlobList = function(container) {
        return new Promise((resolve, reject) => {
            var blobs = [];
            var loop = function(curBlobs) {
                blobService.listBlobsSegmented(container, curBlobs, (err, r) => {
                    if(err) reject(err);
                    else {
                        blobs = blobs.concat(r.entries);
                        if(r.continuationToken !== null) loop(r.continuationToken);
                        else resolve(blobs);
                    }
                })
            }
            loop(null);
        })
    }

    /**
     * get content of blob to text
     */
    exports.getBlobToText = function (container, blob) {
        return new Promise((resolve, reject) => {
            blobService.getBlobToText(container, blob, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    }

    /**
     * save content of blob to file
     */
    exports.getBlobToFile = function (container, blob, filePath) {
        return new Promise((resolve, reject) => {
            blobService.getBlobToLocalFile(container, blob, filePath, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    }

    /**
     * upload blob from a text
     */
    exports.createBlobFromText = function (container, blob, content) {
        return new Promise((resolve, reject) => {
            blobService.createBlockBlobFromText(container, blob, content, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    }

    /**
     * upload blob from a file
     */
    exports.createBlobFromFile = function (container, blob, file) {
        return new Promise((resolve, reject) => {
            blobService.createBlockBlobFromLocalFile(container, blob, file, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    }

    /**
     * delete a container
     */
    exports.deleteContainer = function (container) {
        return new Promise((resolve, reject) => {
            blobService.deleteContainer(container, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    }

    /**
     delete blobs from a container.
     if blobs === undefined, clear the whole container, but not remove the container
     if blobs is a single string, delete the specified container.
     if blobs is array of string, delete the blobs in the array.
     */
    exports.deleteBlob = function(container, blobs) {
        if(blobs === undefined) {
            return exports.deleteContainer(container).then(() => {
                return exports.createContainerIfNotExists(container);
            })
        }
        else if(validate.isStr(blobs)){
            return new Promise((resolve, reject) => {
                blobService.deleteBlob(container, blobs, (err, r) => {
                    if(err) reject(err);
                    else resolve(r);
                })
            })
        }
        else {
            var i = 0;
            var N = blobs.length;

            return async.parallel(() => {
                return i < N;
            }, () => {
                return exports.deleteBlob(container, blobs[i++]);
            }, 50);
        }
    }
    return exports;
};
