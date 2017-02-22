netease = require('../netease');

netease.getStockData().then((data) => {
    console.log('Total stocks: ', data.count);
    console.log('done!');
}).catch((err) => {
    console.log(err);
});
