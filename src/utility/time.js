var moment = require('moment');

/*
exports.formatDate = function(date, format) {
    return moment(date).format(format);
}

//exports.getDateTs = function(date) {
    //date = moment(date).format('YYYY-MM-DD');
    //return moment(date+' 08:00').valueOf() / (60*60*24*1000);
//}

exports.now = function() {
    return new Date();
    //return moment().format('YYYY-MM-DD HH:mm:ss');
}

exports.getTs = function(time) {
    return time.getTime();
    //return moment(time).valueOf();
}

exports.today = function(format) {
    format = format || 'YYYYMMDD';
    return moment().format(format);
}

exports.tomorrow = function(format) {
    format = format || 'YYYYMMDD';
    return moment().add(1, 'day').format('YYYYMMDD');
}

exports.yesterday = function(format) {
    format = format || 'YYYYMMDD';
    return moment().add(-1, 'day').format('YYYYMMDD'); // check
}

exports.nextDay = function(date, format) {
    format = format || 'YYYYMMDD';
    return moment(date).add(1, 'day').format('YYYYMMDD');
}

exports.isBefore = function(day1, day2) {
    return moment(day1).isBefore(day2);
}

exports.isAfter = function(day1, day2) {
    return moment(day1).isAfter(day2);
}
*/


exports.createDate = function(x) {
    var y = moment.utc(x);
    return new Date(Date.UTC(y.year(), y.month(), y.date(), y.hour(), y.second(), y.millisecond()));
}

exports.now = function() {
    return new Date();
}

exports.today = function(time) {
    var x = new Date();
    time = time || {};
    x.setUTCHours(time.hour || 0, time.minute || 0, time.second || 0, time.millisecond || 0);
    return x;
}

exports.getUTCYear = function(x) {
    var y = moment.utc(x);
    return y.year();
}

exports.getUTCMonth = function(x) {
    var y = moment.utc(x);
    return y.month() + 1;
}

exports.getUTCDate = function(x) {
    var y = moment.utc(x);
    return y.date();
}

exports.setUTCHour = function(x, hour) {
    if(!(x instanceof Date)) throw new Error('invalid time input');
    x.setUTCHours(hour);
}

exports.setUTCMinute = function(x, minutes) {
    if(!(x instanceof Date)) throw new Error('invalid time input');
    x.setUTCMinutes(minutes);
}

exports.setUTCMillisecond = function(x, milliseconds) {
    if(!(x instanceof Date)) throw new Error('invalid time input');
    x.setUTCMilliseconds(milliseconds);
}

exports.tomorrow = function(time) {
    var x = exports.today(time);
    x.setUTCDate(x.getUTCDate() + 1);
    return x;
}

exports.yesterday = function(time) {
    var x = exports.today(time);
    x.setUTCDate(x.getUTCDate() - 1);
    return x;
}

exports.nextDay = function(x) {
    var y = exports.createDate(x);
    y.setUTCDate(y.getUTCDate() + 1);
    return y;
}

exports.offsetDay = function(x, offset) {
    var y = exports.createDate(x);
    y.setUTCDate(y.getUTCDate() + offset);
    return y;
}

exports.isAfter = function(x, y) {
    var xts = moment.utc(x).valueOf();
    var yts = moment.utc(y).valueOf();
    return xts - yts > 0;
}

exports.getDateTs = function(x) {
    return exports.getTs(x) / (24*60*60*1000);
    // return Date.UTC(y.year(), y.month(), y.date(), y.hour(), y.second(), y.millisecond())
}

exports.getTs = function(x) {
    var y = moment.utc(x);
    return y.valueOf();
}

exports.format = function(x, format) {
    format = format || 'YYYY-MM-DD hh:mm:sssZ'
    return moment.utc(x).format(format);
}

exports.sameDay = function(x, y) {
    var format = 'YYYYMMDD';
    console.log(exports.format(x, format));
    console.log(exports.format(y, format));
    return exports.format(x, format) === exports.format(y, format);
}
