
var arr = [];
for(var i = 0; i <10; i++){
    arr.push(Promise.resolve(i));
}
for(i = 10; i < 20; i++){
    arr.push(Promise.reject(i));
}

var pool = require('../../src/dataupdate/promisePool');

pool(arr, new Function(), (err) => {console.log('error ', err);}, 5)
.then(() => {console.log('done')}).catch((err) => {console.log('some error: ', err)});
