var moment = require('moment');

exports.formatDate = function(date, format) {
    return moment(date).format(format);
}

exports.getDateTs = function(date) {
    if(date === undefined || date < 0) return -1;
    var date = moment(date);
    var y = date.format('YYYY');
    var m = date.format('MM');
    var d = date.format('DD');
    return Date.UTC(y, m, d) / (60*60*24*1000);;
}

exports.now = function() {
    return moment();
}

exports.today = function() {
    return moment().format('YYYYMMDD');
}

exports.tomorrow = function() {
    return moment().add(1, 'day').format('YYYYMMDD');
}

exports.nextDay = function(date) {
    return moment(date).add(1, 'day').format('YYYYMMDD');
}

exports.isBefore = function(day1, day2) {
    return moment(day1).isBefore(day2);
}

exports.isAfter = function(day1, day2) {
    return moment(day1).isAfter(day2);
}
