var MongoClient = require('mongodb').MongoClient;
var validate = require('./validate');

function Database (url) {
    this.url = url;
    this.dbPromise = function() {
        var db = null;
        return function() {
            db = db !== null ? db : new Promise((resolve, reject) => {
                MongoClient.connect(url, (err, r) => {
                    if(err) reject(err);
                    else resolve(r);
                });
            });
            return db;
        };
    }();
    this.collectionMap = {};
};

Database.prototype.getCollection = function (name, fields) {
    if(name in this.collectionMap) return this.collectionMap[name];
    var dbPromise = this.dbPromise;
    var col = null;
    var colPromise = function() {
        col = col !== null ? col : dbPromise().then((db) => {
            return new Promise((resolve, reject) => {
                db.createCollection(name, (err, r) => {
                    if(err) reject(err);
                    else resolve(r);
                });
            });
        });
        return col;
    }
    var collection = new Collection(colPromise, fields);
    this.collectionMap[name] = collection;
    return collection;
};

Database.prototype.close = function() {
    return this.dbPromise().then((db) => { return db.close(); });
}

function Collection(colPromise, defaultFields) {
    this.colPromise = colPromise;
    this.defaultFields = defaultFields;
}

// opt: {
// 'w': number | string,
// 'wtimeout': number,
// 'j': boolean,
// 'unique': boolean,
// 'sparse': boolean,
// 'background': boolean,
// 'dropDups': boolean,
// 'min': number,
// 'max': number,
// 'v': number,
// 'expireAfterSeconds': number,
// 'name': string,
// 'partialFilterExpression': object
// 'collation': object
// }
Collection.prototype.createIndex = function(index, opt) {
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.createIndex(index, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

// opt: {
// 'w': number | string,
// 'j': boolean,
// 'serializeFunctions': boolean,
// 'forceSeverObjectId': boolean,
// 'bypassDocumentValidation': boolean
// }
Collection.prototype.insert = function(doc, opt) {
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.insert(doc, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

// opt: {
// 'w': number | string,
// 'wtimeout': number
// 'j': boolean,
// 'upsert': boolean,
// 'multi': boolean,
// 'bypassDocumentValidation': boolean,
// 'collation': object
// }
Collection.prototype.update = function(selector, doc, opt) {
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.update(selector, doc, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

// opt: {
// 'w': number | string,
// 'wtimeout': number,
// 'j': boolean,
// 'single': boolean
//}
Collection.prototype.remove = function(selector, opt) {
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.remove(selector, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

Collection.prototype.find = function(filter, field) {
    field = field || this.defaultFields;
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.find(filter, field).toArray((err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

// opt: {
// 'w': number | string,
// 'wtimeout': number,§
// 'j': boolean,
// 'remove': boolean,
// 'upsert': boolean,
// 'new': boolean,
// 'fields': object
// }
Collection.prototype.findAndModify = function(filter, field, opt) {
    var sort = [];
    if(validate.isObj(opt) && opt !== null && 'sort' in opt) {
        sort = opt.sort;
        delete opt.sort;
    }
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.findAndModify(filter, sort, field, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

// opt: {
// 'w': number | string,
// 'wtimeout': number
// 'j': boolean,
// 'upsert': boolean,
// }
Collection.prototype.updateMany = function(filter, update, opt) {
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.updateMany(filter, update, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    })
}

// opt: {
// 'w': number | string,
// 'wtimeout': number,
// 'j': boolean,
// 'serializeFunctions': boolean,
// 'forceSeverObjectId': boolean,
// 'bypassDocumentValidation': boolean
// 'ordered': boolean
// }
Collection.prototype.insertMany = function(docArr, opt) {
    return this.colPromise().then((col) => {
        return new Promise((resolve, reject) => {
            col.insertMany(docArr, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    })
}

module.exports = Database;
