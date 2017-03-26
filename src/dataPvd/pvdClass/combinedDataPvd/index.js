
var combinedPvdGenerator = require('./combinedPvdGenerator');

exports.AddDataPvd = combinedPvdGenerator('add', (a, b) => a + b);
exports.MulDataPvd = combinedPvdGenerator('mul', (a, b) => a * b);
exports.SubDataPvd = combinedPvdGenerator('sub', (a, b) => a - b);
exports.DivDataPvd = combinedPvdGenerator('div', (a, b) => a / b);
exports.AndDataPvd = combinedPvdGenerator('and', (a, b) => a & b);
exports.GtDataPvd = combinedPvdGenerator('gt', (a, b) => a > b, 2, 2);
