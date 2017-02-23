var moment = require('moment');

exports.formatDate = function(date, format) {
    return moment(date).format(format);
}

exports.getDateTs = function(date) {
    var date = moment(date);
    var y = date.format('YYYY');
    var m = date.format('MM');
    var d = date.format('DD');
    return Date.UTC(y, m, d) / (60*60*24*1000);;
}
