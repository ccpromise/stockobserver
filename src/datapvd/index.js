
var statDataPvd = require('./statDataPvd');
var combinedDataPvd = require('./combinedDataPvd');
var stockDataPvd = require('./stockDataPvd');
var basicDataPvd = require('./basicDataPvd');

exports.MADataPvd = statDataPvd.MADataPvd;
exports.StdDataPvd = statDataPvd.StdDataPvd;
exports.BollDataPvd = statDataPvd.BollDataPvd;
exports.EMADataPvd = statDataPvd.EMADataPvd;
exports.MACDDataPvd = statDataPvd.MACDDataPvd;

exports.AddDataPvd = combinedDataPvd.AddDataPvd;
exports.SubDataPvd = combinedDataPvd.SubDataPvd;
exports.MulDataPvd = combinedDataPvd.MulDataPvd;
exports.DivDataPvd = combinedDataPvd.DivDataPvd;

exports.ConstDataPvd = basicDataPvd.ConstDataPvd;
exports.OffsetDataPvd = basicDataPvd.OffsetDataPvd;
exports.DataPvd = basicDataPvd.DataPvd;

exports.EndDataPvd = stockDataPvd.EndDataPvd;
