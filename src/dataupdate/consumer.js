
var queue = require('../utility').dataStructure.queue;
var task = require('./updateStockData');

function consumer(dispatcher) {
    this.dispatcher = dispatcher;
    this.queryTask();
}

consumer.prototype.queryTask = function() {
    var loop = funtion() {
        setTimeout(() => {
            this.dispatcher.getReadySecID().then((secID) => {
                if(task !== null) {
                    task(secID).then(() => {
                        return this.dispatcher.finishTask(task, 'success');
                    }, (err) => {
                        return this.dispatcher.finishTask(task, 'fail', err);
                    }).then(loop);
                }
                else loop();
            });
        }, 5000);
    }
    loop();
}
