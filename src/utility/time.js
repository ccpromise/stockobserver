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


exports.createTime = function(x) {
    return new Date(x);
}

exports.now = function() {
    return new Date();
}

exports.today = function() {
    var x = new Date();
    x.setHours(0, 0, 0, 0);
    return x
}

exports.getYear = function(x) {
    var xDate = new Date(x);
    return xDate.getYear() + 1990;
}

exports.getMonth = function(x) {
    var xDate = new Date(x);
    return xDate.getMonth() + 1;
}

exports.getDate = function(x) {
    var xDate = new Date(x);
    return xDate.getDate() + 1;
}

exports.setHours = function(x, hour) {
    if(!(x instanceof Date)) throw new Error('invalid time input');
    x.setHours(hour);
}

exports.setMinutes = function(x, minutes) {
    if(!(x instanceof Date)) throw new Error('invalid time input');
    x.setMinutes(minutes);
}

exports.setMilliseconds = function(x, milliseconds) {
    if(!(x instanceof Date)) throw new Error('invalid time input');
    x.setMilliseconds(milliseconds);
}

exports.tomorrow = function() {
    var x = new Date();
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() + 1);
    return x;
}

exports.yesterday = function() {
    var x = new Date();
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - 1);
    return x;
}

exports.nextDay = function(x) {
    var xDate = new Date(x);
    xDate.setDate(xDate.getDate() + 1);
    return xDate;
}

exports.isAfter = function(x, y) {
    var xDate = new Date(x);
    var yDate = new Date(y);
    return xDate - yDate > 0;
}

exports.getTs = function(x) {
    var xDate = new Date(x);
    return xDate.getTime();
}

exports.format = function(x, format) {
    format = format || 'YYYY-MM-DD hh:mm:sssZ'
    return moment(x).format(format);
}

exports.getUTCTs = function(year, month, date, hour, minute, second) {
    return Date.UTC(year, month-1, date, hour, minute, second);
}
