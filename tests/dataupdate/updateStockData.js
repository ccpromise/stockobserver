var func = require('../../src/dataupdate/updateStockData');

func().then(() => {console.log('done')}).catch(err => console.log('find error!'));
