
var x = {a:1};
for(let [k,v] of x) console.log(k, v);


var LinkedList = require('../../src/utility').Cache.LinkedList;

var ls = new LinkedList();

ls.addToTail(0);
ls.addToTail(1);
ls.addToTail(2);
ls.addToTail(3);

console.log(ls.toString());
console.log(Object.keys(ls._map).length);
ls.delete(0);
console.log(ls.toString());
console.log(Object.keys(ls._map).length);
ls.addToTail(0);
console.log(ls.toString());
console.log(Object.keys(ls._map).length);
ls.delete(2);
console.log(ls.toString());
console.log(Object.keys(ls._map).length);
ls.addToTail(2);
console.log(ls.toString());
console.log(Object.keys(ls._map).length);
ls.delete(2);
ls.delete(3);
ls.delete(0);
console.log(ls.toString());
console.log(Object.keys(ls._map).length);
ls.addToTail(2);
console.log(ls.toString());
console.log(Object.keys(ls._map).length);
