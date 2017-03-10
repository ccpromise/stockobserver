
var MongoClient = require('mongodb').MongoClient;

///// part of database.js
function database(url) {
    this.url = url;
    this.db = this.connect();
    this.collections = {};
}

database.prototype.connect = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.url, (err, r) => {
            if(err) reject(err);
            else resolve(r);
        })
    })
}

database.prototype.createCollection = function(name) {
    var coll = new Promise((resolve, reject) => {
        this.db.then((db) => {
            db.createCollection(name, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    });
    this.collections[name] = coll;
    return coll;
}

database.prototype.createIndex = function(index, opt, collName) {
    return new Promise((resolve, reject) => {
        this.collections[collName].then((coll) => {
            coll.createIndex(index, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    })
}

database.prototype.insert = function(doc, collName) {
    return new Promise((resolve, reject) => {
        this.collections[collName].then((coll) => {
            coll.insert(doc, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(reject);
    })
}

database.prototype.update = function(selector, doc, opt, collName) {
    return new Promise((resolve, reject) => {
        this.collections[collName].then((coll) => {
            coll.update(selector, doc, opt, (err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(resolve);
    });
}

database.prototype.find = function(filter, field, collName) {
    return new Promise((resolve, reject) => {
        this.collections[collName].then((coll) => {
            coll.find(filter, field).toArray(err, r) => {
                if(err) reject(err);
                else resolve(r);
            })
        }).catch(err);
    })
}


///////// part of StockUpdateDb
function StockUpdateDb(url) {
    database.call(this, url);
    this.createCollection('syncDate');
}

StockUpdateDb.prototype.getSyncDate(secID) {
    return this.find({'secID': secID}, {'date': true}, 'syncDate').then((arr) => {
        return arr[0].date;
    })
}

//////// part of dispatcher
var mongdbUrl = 'XXXX'
function dispatcher() {
    this.db = new StockUpdateDb(mongodbUrl);
    this.setProducer();
}

dispatcher.prototype.setProducer = function(){
    var loop = function() {
        setTimeout(() => {
            var syncTime = time.today('YYYY-MM-DD') + ' ' + this.syncTime;
            if(time.isAfter(time.now(), syncTime)) {
                getStockList.then((list) => {
                    var promises = list.map((secID) => {
                        return this.db.getSyncDate(secID).then((date) => {
                            //omit
                        })
                    })
                })
            }
            else loop();
        }, 5000);
    }
    loop();
}
