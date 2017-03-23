
var Database = require('../../utility').database;
var mongoUrl = require('../../config').mongoUrl;

module.exports = new Database(mongoUrl);
