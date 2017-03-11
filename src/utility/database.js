
var MongoClient = require('mongodb').MongoClient;
var validate = require('../utility').validate;

function Database(url) {
    this.url = url;
    this.db = function() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.url, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        });
    }
    this.collectionMap = {};
}

Database.prototype.getCollection = function(name, fileds) {
    if(name in this.collectionMap) return this.collectionMap[name];
    var coll = new Collection(function() {
        return new Promise((resolve, reject) => {
            this.db().then((db) => {
                db.createCollection(name, (err, r) => {
                    if(err) reject(err);
                    else resolve(r);
                })
            }).catch(reject);
        });
    }, fileds);
    this.collectionMap[name] = coll;
    return coll;
}

function Collection(coll, defaultFields) {
    this.collection = coll;
    this.defaultFields = defaultFields;
}

Collection.prototype.createIndex = function(index, opt) {
    if(validate.isFunction(this.collection)) this.collection = this.collection();
    return new Promise((resolve, reject) => {
        this.collection.then((coll) => {
            coll.createIndex(index, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    })
}

Collection.prototype.insert = function(doc) {
    if(validate.isFunction(this.collection)) this.collection = this.collection();
    return new Promise((resolve, reject) => {
        this.collection.then((coll) => {
            coll.insert(doc, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    })
}

Collection.prototype.update = function(selector, doc, opt) {
    if(validate.isFunction(this.collection)) this.collection = this.collection();
    return new Promise((resolve, reject) => {
        this.collection.then((coll) => {
            coll.update(selector, doc, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    });
}

Collection.prototype.remove = function(selector, opt) {
    if(validate.isFunction(this.collection)) this.collection = this.collection();
    return new Promise((resolve, reject) => {
        this.collection.then((coll) => {
            coll.remove(selector, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            });
        }).catch(reject);
    });
}

Collection.prototype.find = function(filter, field) {
    if(validate.isFunction(this.collection)) this.collection = this.collection();
    field = field : this.defaultFields;
    return new Promise((resolve, reject) => {
        this.collection.then((coll) => {
            coll.find(filter, ield).toArray(err, r) => {
                if(err) reject(err);
                else resolve(r);
            }
        }).catch(reject);
    })
}

Collection.prototype.findAndModify = function(filter, sort, field, opt) {
    if(validate.isFunction(this.collection)) this.collection = this.collection();
    return new Promise((resolve, reject) => {
        this.collection.then((coll) => {
            coll.findAndModify(filter, sort, field, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    })
}

Collection.prototype.findOneAndUpdate = function(filter, update, opt) {
    if(validate.isFunction(this.collection)) this.collection = this.collection();
    return new Promise((resolve, reject) => {
        this.collection.then((coll) => {
            coll.findOneAndUpdate(filter, update, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    })
}

module.exports = Database;
