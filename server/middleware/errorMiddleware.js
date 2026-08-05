const MESSAGES = require("../constants/messages");

const errorHandler = (err, req, res, next) => {

    let statusCode =
        res.statusCode === 200
            ? 500
            : res.statusCode;

    let message = err.message;

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 404;
        message = MESSAGES.COMMON.RESOURCE_NOT_FOUND;
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");
    }

    // Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;

        const field = Object.keys(err.keyValue)[0];

        message = `${field} already exists`;
    }

    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = MESSAGES.COMMON.INVALID_TOKEN;
    }

    // Expired JWT
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = MESSAGES.COMMON.TOKEN_EXPIRED;
    }

    return res.status(statusCode).json({
        success: false,
        message,
        stack:
            process.env.NODE_ENV === "production"
                ? undefined
                : err.stack,
    });

};

module.exports = errorHandler;