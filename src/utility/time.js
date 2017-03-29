
const moment = require('moment');

/**
 * create utc time
 */
exports.createDate = function(x) {
    var y = moment.utc(x);
    return new Date(Date.UTC(y.year(), y.month(), y.date(), y.hour(), y.minute(), y.second(), y.millisecond()));
}

/**
 * return a Date instance
 */
exports.now = function() {
    return new Date();
}

/**
 * return a Date instance.
 */
exports.today = function(time) {
    var x = new Date();
    time = time || {};
    x.setUTCHours(time.hour || 0, time.minute || 0, time.second || 0, time.millisecond || 0);
    return x;
}

/**
 * return utc year
 */
exports.getUTCYear = function(x) {
    var y = moment.utc(x);
    return y.year();
}

/**
 * return utc month
 */
exports.getUTCMonth = function(x) {
    var y = moment.utc(x);
    return y.month() + 1;
}

/**
 * return utc date
 */
exports.getUTCDate = function(x) {
    var y = moment.utc(x);
    return y.date();
}

/**
 * return utc date
 */
exports.tomorrow = function(time) {
    var x = exports.today(time);
    x.setUTCDate(x.getUTCDate() + 1);
    return x;
}

/**
 * return utc date
 */
exports.yesterday = function(time) {
    var x = exports.today(time);
    x.setUTCDate(x.getUTCDate() - 1);
    return x;
}

/**
 * return utc date
 */
exports.nextDay = function(x) {
    var y = exports.createDate(x);
    y.setUTCDate(y.getUTCDate() + 1);
    return y;
}

/**
 * return utc date. If offset is negative, return the previous date. Otherwise return the future date.
 */
exports.offsetDay = function(x, offset) {
    var y = exports.createDate(x);
    y.setUTCDate(y.getUTCDate() + offset);
    return y;
}

/**
 * compare two time
 */
exports.isAfter = function(x, y) {
    var xts = moment.utc(x).valueOf();
    var yts = moment.utc(y).valueOf();
    return xts - yts > 0;
}

/**
 * return the number of days since January 1, 1970.
 */
exports.getDateTs = function(x) {
    return exports.getTs(x) / (24*60*60*1000);
}

/**
 * return timestamp
 */
exports.getTs = function(x) {
    var y = moment.utc(x);
    return y.valueOf();
}

/**
 * format a date, return a string
 */
exports.format = function(x, format) {
    format = format || 'YYYY-MM-DD hh:mm:sssZ'
    return moment.utc(x).format(format);
}

/**
 * compare two days if they are the same date, regardless of hour&minute&second
 */
exports.sameDay = function(x, y) {
    var format = 'YYYYMMDD';
    return exports.format(x, format) === exports.format(y, format);
}
