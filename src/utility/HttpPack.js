
const url = require('url');
const validate = require('./validate');

module.exports = HttpPack;

function HttpPack (req, res) {
    this._req = req;
    this._res = res;
    this._url = url.parse(req.url);
    this._status = null;
    this._resBody = new Buffer('');
    this._hasSent = false;

    Object.defineProperties(this, {
        'status': {
            set: (val) => { this._status = val; }
        },
        'reqPath': {
            get: () => { return this._url.pathname; }
        },
        'resBody': {
            set: (val) => {
                var type = null, body = null;
                if(validate.isObj(val) || validate.isArr(val) || val === null) {
                    type = 'application/json';
                    body = Buffer.from(JSON.stringify(val));
                }
                else if(validate.isStr(val)) {
                    type = 'text/plain';
                    body = Buffer.from(val);
                }
                else if(Buffer.isBuffer(val)){
                    type = '';
                    body = Buffer.from(val);
                }
                else {
                    throw new Error('invalid body type');
                }
                this._res.setHeader('content-type', type);
                this._resBody = body;
            }
        }
    })

}

HttpPack.prototype.getReqHeader = function (name) {
    return this._req.headers[name.toLowerCase()];
};

HttpPack.prototype.setResHeader = function (key, val) {
    this._res.setHeader(key.toLowerCase(), val);
};

HttpPack.prototype.send = function () {
    if(this._hasSent) throw new Error('response has been sent');
    this._hasSent = true;
    this._status = this._status || 200;
    this._res.writeHead(this._status);
    this._res.end(this._resBody);
};

HttpPack.prototype.reqBody = function () {
    var that = this;
    return new Promise((resolve) => {
        var body = [];
        that._req.on('data', (chunk) => body.push(chunk));
        that._req.on('end', () => {
            resolve(Buffer.concat(body));
        })
    })
}