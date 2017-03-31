
var Cache = require('../../src/utility').Cache;

var cache = new Cache(5, true);

cache.set(1, 1);
cache.set(2, 1);
cache.set(3, 1);
cache.set(4, 1);
cache.set(5, 1);
cache.addReference(2, 1);
//cache.addReference(3, 1);
//cache.addReference(5, 1);
//cache.addReference(4, 2);
cache.addReference(3, 2);
cache.addReference(5, 4);
cache.set(3, 1);
cache.set(6, 1);
//cache.addReference(1, 3);
console.log(cache.toString());

/*
cache.get(1);
cache.set(2, 2);
cache.set(6, 1);
console.log(cache.toString());
cache.set(7, 1);
console.log(cache.toString());
cache.set(4, 2);
cache.get(7);
console.log(cache.toString());
//cache.get(5);
//console.log(cache.toString());
*/
