const config = require('../configs/app.conf');
const logger = require('../utils/Logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500;

    logger.error(`[${statusCode}] ${err.message}`, { 
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent'], 
        stack: err.stack 
    });    

    res.status(statusCode).json({
        title: getErrorTitle(statusCode),
        message: err.message,
        stackTrace: config.env === 'development' ? err.stack : undefined,
    });
};

const getErrorTitle = (statusCode) => {
    const titles = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        413: "Payload Too Large",
        414: "URI Too Long",
        415: "Unsupported Media Type",
        422: "Unprocessable Entity",
        429: "Too Many Requests",
        500: "Internal Server Error",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout"
    };

    return titles[statusCode] || "Unexpected Error";
};

module.exports = errorHandler;