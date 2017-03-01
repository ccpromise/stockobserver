
exports.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

exports.contentEqual = function(obj1, obj2) {
    var keys = Object.keys(obj1);
    if(keys.length != Object.keys(obj2).length)
        return false;
    return keys.every((key) => { return key in obj2 && obj1[key] === obj2[key]; });
}
