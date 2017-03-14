var moment = require('moment');

exports.formatDate = function(date, format) {
    return moment(date).format(format);
}

exports.getDateTs = function(date) {
    date = moment(date).format('YYYY-MM-DD');
    return moment(date+' 08:00').valueOf() / (60*60*24*1000);
}

exports.now = function() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

exports.valueOf = function(time) {
    return moment(time).valueOf();
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
