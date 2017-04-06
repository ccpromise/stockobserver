
exports.task = {
    http: require('./task/http'),
    db: require('./task/db')
}

exports.trade = {
    http: require('./trade/http'),
    db: require('./trade/db')
}

exports.simulate = {
    http: require('./simulate/http'),
    db: require('./simulate/db')
}