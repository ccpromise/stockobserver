
exports.HttpError = HttpError;

function HttpError(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
    var error = new Error();
    this.stack = error.stack;
}

HttpError.prototype = Object.create(Error.prototype);
