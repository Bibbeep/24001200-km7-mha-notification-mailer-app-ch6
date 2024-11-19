require('./instrument');
const HttpRequestError = require("./error");
const Sentry = require('@sentry/node');

module.exports = (err, req, res, next) => {
    Sentry.captureException(err); // I have to do this bcs custom exception is not captured automatically by Sentry
    if (err instanceof HttpRequestError) {
        return res.status(err.statusCode).json({
            status: 'Fail',
            message: err.message
        });
    }

    return res.status(500).json({
        status: 'Fail',
        message: 'Internal server error'
    });
}