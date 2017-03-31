
/**
 * data structure: Cache
 * maxSize: positive number
 * deleteRef: boolean, default value is false.
 *  when cache is full and need to delete a cache item, whether delete all the other cache items which refers to it.
 */
module.exports = Cache;

function Cache(maxSize, deleteRef) {
    if(maxSize <= 0) throw new Error('maxSize should be positive');
    this._maxSize = maxSize;
    this._cache = Object.create(null);
    this._referTo = Object.create(null);
    this._referredBy = Object.create(null);
    this._list = new LinkedList();
    this._deleteRef = deleteRef || false;
}

/**
 * return boolean value to judge if a key exists in cache.
 */
Cache.prototype.has = function(key) {
    return key in this._cache;
}

/**
 * get the cached value associated with key
 */
Cache.prototype.get = function(key) {
    if(!this.has(key)) throw new Error('cache not exit!');
    //* when getting a val, we should set this key and other items referred by key as most recently used.
    if(key in this._referredBy) {
        for(let ref of this._referredBy[key]) {
            this.set(ref, this._cache[ref]);
        }
    }
    this._list.delete(key);
    this._list.addToTail(key);
    return this._cache[key];
}

/**
 * set a key-val pair in cache. if key already exists, update the val.
 */
Cache.prototype.set = function(key, val) {
    //* when setting a key-val pair, we should set this key and other items referred by key as most recently used.
    if(key in this._referredBy) {
        for(let ref of this._referredBy[key]) {
            this.set(ref, this._cache[ref]);
        }
    }
    if(this.has(key)) this._list.delete(key);
    this._list.addToTail(key);
    this._cache[key] = val;
    if(this.size() > this._maxSize) this._delete(this._list.head());
}

Cache.prototype.size = function() {
    return Object.keys(this._cache).length;
}

/**
 * key1 has reference to key2.
 * when delete key2 from cache and free memory its memory,
 * should delete both key1 and key2 from cache, and make them point to null.
 */
Cache.prototype.addReference = function(key1, key2) {
    if(!(key2 in this._referTo)) this._referTo[key2] = new Set();
    if(!(key1 in this._referredBy)) this._referredBy[key1] = new Set();
    //* if key1 has already been referred key2, key1 cannot refer to key2 since it produces a circular reference.
    if(this._hasRef(key2, key1)) throw new Error('circular reference!');
    this._referTo[key2].add(key1);
    this._referredBy[key1].add(key2);
}

Cache.prototype._hasRef = function(key1, key2) {
    if(key1 === key2) return true;
    if(!(key1 in this._referredBy)) return false;
    for(let ref of this._referredBy[key1]) {
        if(this._hasRef(ref, key2)) return true;
    }
    return false;
}

/**
 * remove least recently used item along with items refering to it from cache and free its memory
 */
Cache.prototype._delete = function(rmKey) {
    this._list.delete(rmKey);
    delete this._cache[rmKey];
    //* if rmKey refers to other keys, say x, remove rmKey from this._referTo[x]
    if(rmKey in this._referredBy) {
        for(let ref of this._referredBy[rmKey])
            this._referTo[ref].delete(rmKey);
        delete this._referredBy[rmKey];
    }
    /**
     * if rmKey is referred by other keys, say x, remove rmKey from this._referredBy[x].
     * if this._deleteRef is true, then x should be delete from cache too.
    */
    if(rmKey in this._referTo) {
        for(let ref of this._referTo[rmKey]) {
            this._referredBy[ref].delete(rmKey);
        }
        if(this._deleteRef) {
            for(let ref of this._referTo[rmKey]) {
                this._delete(ref);
            }
        }
        delete this._referTo[rmKey];
    }
}

/**
 * visualize the Cache object.
 */
Cache.prototype.toString = function() {
    var cache = '';
    for(let key in this._cache) cache += key + ': ' + this._cache[key] + '\n';
    var list = this._list.toString();
    var referredBy = '';
    for(let key in this._referredBy) {
        var vals = [];
        for(let val of this._referredBy[key]) vals.push(val);
        referredBy += key + ' refers to ' + vals.join(',') + '\n';
    }
    var referTo = '';
    for(let key in this._referTo) {
        var vals = [];
        for(let val of this._referTo[key]) vals.push(val);
        referTo += key + ' is referred by ' + vals.join(',') + '\n';
    }
    return 'cache: ' + cache + 'list: ' + list + '\nreferredBy: ' + referredBy + 'referTo: ' + referTo;
}

/**
 * data structure: ListNode
 */
function ListNode(val) {
    this.val = val;
    this.front = null;
    this.next = null;
}

/**
 * data structure: double linked list.
 * use linked list to implement least recently used algorithm.
 */
function LinkedList() {
    this._head = null;
    this._tail = null;
    this._map = Object.create(null);
}

/**
 * add a val to the tail of linked list, marked as most recently used.
 */
LinkedList.prototype.addToTail = function(val) {
    this._map[val] = new ListNode(val);
    var node = this._map[val];
    if(this._head === null) {
        this._head = node;
        this._tail = node;
    }
    else {
        node.front = this._tail;
        this._tail.next = node;
        this._tail = node;
    }
}

/**
 * delete a val in linked list.
 */
LinkedList.prototype.delete = function(val) {
    if(!(val in this._map)) throw new Error('val not in linked list');
    var node = this._map[val];
    if(node === this._head) {
        if(this._head.next === null) {
            this._head = null;
            this._tail = null;
        }
        else {
            this._head.next.front = null;
            this._head = this._head.next;
        }
    }
    else {
        node.front.next = node.next;
        if(node.next !== null) {
            node.next.front = node.front;
        }
        else {
            this._tail = this._tail.front;
        }
    }
    delete this._map[val];
}

/**
 * return the val in the head of linked list, which represents the least frequently used item.
 */
LinkedList.prototype.head = function() {
    return this._head.val;
}

/**
 * visualize LinkedList object
 */
 LinkedList.prototype.toString = function() {
     var node = this._head;
     var vals = [];
     while(node !== null) {
         vals.push(node.val);
         node = node.next;
     }
     return vals.join(',');
 }
