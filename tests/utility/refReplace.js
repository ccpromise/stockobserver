
var refReplace = require('../../src/utility/refReplace');

var valueMap ={
    "key1": "value of key1",
    "key2": 123,
    "key3": {
        m: "{{key4}}",
    },
    "key4": {
        value: "{{key2}}"
    }
}

var obj = {
   "a": "{{key1}}",
   "b": [
       1,
       true,
       "{{key2}}"
   ],
   "c": {
       "d": "{{key3}}",
       "l": "{{key4}}"
   },
   "e": 123,
   "m": "normal string"
}

try {
    console.log(refReplace(obj, valueMap));
}
catch (err) {
    console.log(err);
}
