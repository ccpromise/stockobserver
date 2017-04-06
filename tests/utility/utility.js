
var validate = require('../../src/utility').validate;

var obj = {
    name: 'cc',
    age: 25
}

console.log(validate.hasOwnProperty(obj, ['name', 'age']));

console.log(['1','2'].every(validate.isStr));
