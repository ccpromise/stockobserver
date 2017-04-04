
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const validate = require('./validate');

/**
 * create a Database
 */
function Database (url) {
    this.url = url;
    this.dbPromise = null;
    this.collectionMap = Object.create(null);
};

Database.prototype._getDb = function() {
    if(this.dbPromise === null) {
        this.dbPromise = new Promise((resolve, reject) => {
            MongoClient.connect(this.url, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    }
    return this.dbPromise;
}

/**
 crete a collection if not exist.
 */
Database.prototype.getCollection = function (name, fields) {
    if(name in this.collectionMap) return this.collectionMap[name];
    var collection = new Collection(this, name, fields);
    this.collectionMap[name] = collection;
    return collection;
};

/**
 * create a collection in db.
 */
function Collection(db, name, defaultFields) {
    this.db = db;
    this.colPromise = null;
    this.name = name;
    this.defaultFields = defaultFields;
}

Collection.prototype._getCol = function() {
    if(this.colPromise === null) {
        this.colPromise = this.db._getDb().then((db) => {
            return new Promise((resolve, reject) => {
                db.createCollection(this.name, (err, r) => {
                    if(err) reject(err);
                    else resolve(r);
                });
            });
        });
    }
    return this.colPromise;
}

// opt: {
// 'w': number | string,
// 'j': boolean,
// 'serializeFunctions': boolean,
// 'forceSeverObjectId': boolean,
// 'bypassDocumentValidation': boolean
// }
Collection.prototype.insert = function(doc, opt) {
    return this._getCol().then((col) => {
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
Collection.prototype.update = function(filter, doc, opt) {
    opt = opt || Object.create(null);
    opt.multi = opt.multi || true;
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            col.update(filter, doc, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

Collection.prototype.upsert = function(filter, doc, opt) {
    opt = opt || Object.create(null);
    opt.upsert = true;
    return this.update(filter, doc, opt);
}

// doc: [
// {'filter': , 'update': }
// ]
Collection.prototype.updateMany = function(docs, useUpsert) {
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            var bulk = col.initializeUnorderedBulkOp();
            docs.forEach(doc => {
                if(useUpsert) bulk.find(doc.filter).upsert().update(doc.update);
                else bulk.find(doc.filter).update(doc.update);
            });
            bulk.execute((err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        })
    })
}

// docs: [
// {'filter': , 'update': }
// ]
Collection.prototype.upsertMany = function(docs) {
    return this.updateMany(docs, true);
}

// opt: {
// 'w': number | string,
// 'wtimeout': number,
// 'j': boolean,
// 'single': boolean
//}
Collection.prototype.remove = function(filter, opt) {
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            col.remove(filter, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

Collection.prototype.find = function(filter, field, sort) {
    field = field || this.defaultFields;
    sort = sort || { $nature: 1 };
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            col.find(filter, field).sort(sort).toArray((err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    });
};

Collection.prototype.count = function (filter) {
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            col.count(filter, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    })
};

// opt: {
// limit: number,
// sort: array|object,
// fields: object,
// skip: number,
// hit: object,
// explain: boolean,
// snapshot: boolean,
// timeout: boolean,
// tailable: boolen,
// batchSize: number,
// returnKey: boolean,
// maxScan: number,
// min: number,
// max: number,
// showDiskLoc: boolean,
// commnet: string,
// raw: boolean,
// promoteLongs: boolean,
// promoteValue: boolean,
// promoteBuffers: boolean,
// readPreference: string
// partial: boolean,
// maxTimeMS: number,
// collation: object
// }
Collection.prototype.findOne = function(filter, field, opt) {
    opt = opt || Object.create(null);
    field = field || this.defaultFields;
    opt.fields = field;
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            col.findOne(filter, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    })
}

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
    opt = opt || Object.create(null);
    if(opt.new !== false) opt.new = true;
    var sort = [];
    if(opt !== undefined && opt !== null && 'sort' in opt) {
        sort = opt.sort;
        delete opt.sort;
    }
    return this._getCol().then((col) => {
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
// 'wtimeout': number,
// 'j': boolean,
// 'serializeFunctions': boolean,
// 'forceSeverObjectId': boolean,
// 'bypassDocumentValidation': boolean
// 'ordered': boolean
// }
Collection.prototype.insertMany = function(docArr, opt) {
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            col.insertMany(docArr, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    })
}

Collection.prototype.findPagination = function(filter, pageNum, pageSize, sort) {
    sort = sort || { $nature: 1 };
    return this._getCol().then((col) => {
        return new Promise((resolve, reject) => {
            col.find(filter).sort(sort).skip((pageNum - 1) * pageSize).limit(pageSize).toArray((err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        })
    })
}

module.exports = Database;
