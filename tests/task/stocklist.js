var r = {
    'id': 123,
    'task': {
        'type': 'stocklist'
    }
}

var execute = require('../../src/task/consumer/consumer.js');

execute(r);
