
function node(val) {
    this.val = val;
    this.next = null;
}

function queue() {
    this.head = null;
    this.tail = null;
}

queue.prototype.isEmpty = function() {
    return this.head === null;
}

queue.prototype.push = function(val) {
    var n = new node(val);
    if(this.head === null) {
        this.head = n;
        this.tail = n;
    }
    else {
        this.tail.next = n;
        this.tail = n;
    }
}

queue.prototype.pop = function() {
    if(this.isEmpty()) throw new Error('queue is empty');
    var res = this.head.val;
    this.head = this.head.next;
    if(this.head === null) {
        this.tail = null;
    }
    return res;
}

export.queue = queue;
