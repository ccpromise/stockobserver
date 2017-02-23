
var getClosePriceofOne = require('../datasrc/wmcloud').getClosePriceofOne;

function MADataPvd(stock, N) {
    this.historyClosePrice = {};
    this.historyTs = [];
    this.maxTs = 0;
    this.minTs = 0;
    this.N = N;
    this.promise = getClosePriceofOne(stock['secID']).then((data) => {
        // {
        //    '17167': {e : 9.48}
        // }
        var idx = 0;
        for(ts in data) {
            this.historyTs.push(ts);
            data[ts].idx = idx;
            idx += 1;
        }
        var totalTs = this.historyTs.length;
        this.maxTs = totalTs >= N ? this.historyTs[totalTs-1] : -1;
        this.minTs = totalTs >= N ? this.historyTs[N-1] : -1;
        this.historyClosePrice = data;
        // this.historyClosePrice: {
        //   '17167': {e: , idx: 23},
        //   '17168': {e: , idx: 24},
        // }
        // ts.idx is the index of ts in this.historyTs
        // this.historyTs: [...., '17167', '17168', ...]
    });
}

MADataPvd.prototype.get = function(datets) {
    return new Promise((resolve, reject) => {
        this.promise.then(() => {
            var data = this.historyClosePrice;
            if(datets in data) {
                if(datets < this.minTs || datets > this.maxTs) {
                    reject('datets ' + datets + ' is invalid');
                }
                else {
                    var sum = 0;
                    var idx = data[datets].idx;
                    // The data on these ts should be calculated:
                    // this.historyTs[idx]],this.historyTs[idx-1], ..., this.historyTs[idx-N+1]
                    var i = 0;
                    while(i < this.N) {
                        sum += data[this.historyTs[idx]].e;
                        idx --;
                        i ++;
                    }
                    resolve(res/this.N);
                }
            }
            else {
                reject('No trade data on datets ' + datets);
            }
        })
    })
}

MADataPvd.prototype.maxTs = function(){
    return this.maxTs;
}

MADataPvd.prototype.minTs = function(){
    return this.minTs;
}

MADataPvd.prototype.hasDef = function(datets) {
    return datets in this.historyClosePrice && datets >= this.maxTs && datets <= this.minTs;
}

var x = new MADataPvd({ 'secID': '000001.XSHE'}, 5);
x.get(14788).then((res) => console.log(res)).catch(err => console.log(err.message));
