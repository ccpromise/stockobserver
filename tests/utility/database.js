
var Database = require('../../src/utility/database');

var db = new Database('mongodb://127.0.0.1:27017');
var col1 = db.getCollection('test_new', {'name': true});

col1.remove({}).then(() => { return col1.insertMany([{'name': 'cc'}, {'name':'cy'}])}).then((r) => {
    col1.update({'name': { $in: ['cx', 'cc']}}, { $set: {'age': 29}}, {'multi': true, 'upsert':true}).then((r) => {
        console.log(r);
        col1.find({}, {'name': true, 'age': true}).then((r) => {
            console.log(r);
        })
    })
});
/*
col1.insert({'name': 'cc', 'age': 25}).then((r) => {
    console.log(r);
    return col1.insertMany([{'name':'cc', 'age':26}, {'name': 'cy', 'age': 27}]);
}).then((r) => {
    console.log(r);
    return col1.updateMany({'name': 'cc'}, {$set: {'age':26}});
}).then((r) => {
    console.log(r);
    return col1.update({'name':'cy'}, {$set: {'age':28}});
}).then((r) => {
    console.log(r);
    return col1.remove({'name': 'cy'});
}).then((r) => {
    console.log(r);
    return col1.find({'name': 'cy'});
}).then((r) => {
    console.log(r);
    return col1.findAndModify({'name':'cc'}, {$set: {'age':100}});
}).then((r) => {
    console.log(r);
    return col1.find({});
}).then((r) => {
    console.log(r);
    return col1.updateMany({'name': 'cc'}, {$set: {'age': 25}});
}).then((r) => {
    console.log(r);
    setTimeout(() => {
        db.close();
    }, 5000);
});*/
