var fs = require('fs');
var tmp = require('tmp');

function createTmpFile(opt) {
    var extend = '.txt';
    var discardDescriptor = true;
    if(opt !== undefined && opt !== null) {
        extend = opt.extend || extend;
        discardDescriptor = opt.discardDescriptor || discardDescriptor;
    }
    return new Promise((resolve, reject) => {
        tmp.file({ discardDescriptor: discardDescriptor,  keep: true, postfix: extend},(err, path, fd, callback) => {
            if(err) reject(err);
            else resolve([path, callback]);
        })
    })
}

function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if(err) reject(err);
            else resolve();
        })
    })
}

function writeToCSV(path, data) {
    // data: array of object, each object has the same keys
    var content = "";
    var len = data.length;
    if(len != 0) {
        var keys = Object.keys(data[0]);
        content = keys.join("\",\"");
        content = "\"" + content + "\"\n";
        data.forEach((obj) => {
            var arr = [];
            keys.forEach((key) => {
                arr.push(obj[key]);
            });
            content += "\""+arr.join("\",\"")+"\"\n";
        });
    }
    return writeFile(path, content);
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    })
}

exports.writeToCSV = writeToCSV;
exports.writeFile = writeFile;
exports.readFile = readFile;
exports.createTmpFile = createTmpFile;
