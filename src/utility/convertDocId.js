
var object = require('./object');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(args, verb) {
    var getId = function(id) {
        var objId = new ObjectId(id);
        return objId === null ? id : objId;
    }
    args = object.clone(args);
    if((verb === 'find' || verb === 'findOne') && args[0]._id) {
        args[0]._id = getId(args[0]._id);
    }
    if(verb === 'updateMany') {
        var N = args[0].length;
        for(var i = 0; i < N; i ++) {
            if(args[0][i].filter._id) {
                args[0][i].filter._id = getId(args[0][i].filter._id);
            }
        }
    }
    return args;
}
