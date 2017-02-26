
var DataPvd = require('./DataPvd');

module.exports = EndDataPvd;

function EndDataPvd(stock) {
    return new DataPvd(stock, (obj) => { return obj['e']; });
}
