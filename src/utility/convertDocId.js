
var object = require('./object');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(args, verb) {
    args = object.clone(args);
    if((verb === 'find' || verb === 'findOne') && args[0]._id) {
        args[0]._id = new ObjectId(args[0]._id);
    }
    if(verb === 'updateMany') {
        var N = args[0].length;
        for(var i = 0; i < N; i ++) {
            if(args[0][i].filter._id) {
                args[0][i].filter._id = new ObjectId(args[0][i].filter._id);
            }
        }
    }
    return args;
}
