
var dir = '../utility';
var fs = require('fs');

fs.readdir(dir, (err, r) => {
    if(!err) console.log(r);
})
