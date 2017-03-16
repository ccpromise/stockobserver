
var Database = require('../../src/utility/database');

var db = new Database('mongodb://127.0.0.1:27017');
var col1 = db.getCollection('test_new', {'name': true});
var col3 = db.getCollection('test_new', {'name': true});

col1.findAndModify({'name': 'cc'}, { $set: { 'name': 'cy' }}).then((r) => {
    console.log(r);
    db.close();
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
