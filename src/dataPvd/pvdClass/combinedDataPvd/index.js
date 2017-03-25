
var combinedPvdGenerator = require('./combinedPvdGenerator');

exports.AddDataPvd = combinedPvdGenerator('add', getFuncTmpl((a, b) => a + b));
exports.MulDataPvd = combinedPvdGenerator('mul', getFuncTmpl((a, b) => a * b));
exports.SubDataPvd = combinedPvdGenerator('sub', getFuncTmpl((a, b) => a - b));
exports.DivDataPvd = combinedPvdGenerator('div', getFuncTmpl((a, b) => a / b));
exports.AndDataPvd = combinedPvdGenerator('and', getFuncTmpl((a, b) => a & b));
exports.GtDataPvd = combinedPvdGenerator('gt', gtGetFunc);

function getFuncTmpl(operator) {
    return function(ts) {
        if(!this.hasDef(ts)) throw new Error('invalid ts');
        return this.pvds.map(pvd => pvd.get(ts)).reduce(operator);
    }
}

function gtGetFunc(ts) {
    if(!this.hasDef(ts)) throw new Error('invalid ts');
    var values = this.pvds.map(pvd => pvd.get(ts));
    var N = values.length;
    for(var i = 1; i < N; i++) {
        if(values[i] >= values[0]) return false;
    }
    return true;
}
