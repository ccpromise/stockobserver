
exports.convertToYYYYMMDD = function(date) {
    if(new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).test(date))
        return date.slice(0,4).concat(date.slice(5,7)).concat(date.slice(8));
    return '';
};
