
const Database = require('../../utility').database;
const mongoUrl = require('../../config').mongoUrl;

module.exports = new Database(mongoUrl);
