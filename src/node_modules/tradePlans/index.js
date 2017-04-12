
var end = function(secID) {
    return {
        type: 'end',
        pack: secID
    }
}

var ma = function(pvd, N) {
    return {
        type: 'ma',
        pack: {
            N: N,
            pvd: pvd
        }
    }
}

var maend = function(N) {
    return ma(end('{{secID}}'), N);
}

var gt = function(pvds, idx) {
    return {
        type: 'gt',
        pack: {
            idx: idx,
            pvds: pvds
        }
    }
}

var and = function(pvds, idx) {
    return {
        type: 'and',
        pack: {
            idx: idx,
            pvds: pvds
        }
    }
}

var offset = function(pvd, N) {
    return {
        type: 'offset',
        pack: {
            pvd: pvd,
            N: N
        }
    }
}

exports.MA1060 = {
    '_id': 'MA1060',
    'desc': 'buy when MA10 upcrosses MA60. sell when MA10 downcross MA60.',
    'dpInTmpl': and([offset(gt([maend(60), maend(10)], 0), -1), gt([maend(10), maend(60)], 1)], 0),
    'dpOutTmpl': and([offset(gt([maend(10), maend(60)], 1), -1), gt([maend(60), maend(10)], 0)], 0)
}
