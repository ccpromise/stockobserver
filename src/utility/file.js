
const fs = require('fs');

/**
 * async write data to file
 */
exports.writeFile = function (path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if(err) reject(err);
            else resolve();
        })
    })
}

/**
 * save objArr to csv file. the first line is keys.
 * objArr: array of obj of the same type
 */
exports.writeToCSV = function (path, objArr) {
    var content = '';
    if(objArr.length != 0) {
        content = '"' + Object.keys(objArr[0]).join('","') + '"\n';
        objArr.forEach((obj) => {
            content += '"' + Object.values(obj).join('","') +  + '"\n';
        });
    }
    return exports.writeFile(path, content);
}

/**
 * async read file from a path.
 */
exports.readFile = function (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    })
}

/**
 * async return name of files in a directory
 */
exports.readDirectory = function (dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, r) => {
            if(err) reject(err);
            else resolve(r);
        })
    })
}

/**
 * async return the status of a file
 */
exports.stat = function (file) {
    return new Promise((resolve, reject) =>{
        fs.stat(file, (err, stats) => {
            if(err) reject(err);
            else resolve(stats);
        })
    })
}
