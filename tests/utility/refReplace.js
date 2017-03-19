
var refReplace = require('../../src/utility/refReplace');

var valueMap ={
    "key1": "value of key1",
    "key2": 123,
    "key3": {
        m: "{{key1}}",
    },
}

var obj = {
   "a": "{{key1}}",
   "b": [
       1,
       true,
       "{{key2}}"
   ],
   "c": {
       "d": "{{key3}}"
   },
   "e": 123,
   "m": "normal string"
}

try {
    refReplace(obj, valueMap);
}
catch (err) {
    console.log(err);
}
