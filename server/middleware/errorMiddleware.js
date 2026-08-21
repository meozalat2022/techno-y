const MESSAGES =
    require("../constants/messages");


const errorHandler = (
    err,
    req,
    res,
    next
) => {

    let statusCode =
        res.statusCode === 200
            ? 500
            : res.statusCode;

    let message =
        err.message;


    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {

        statusCode = 404;

        message =
            MESSAGES.COMMON
                .RESOURCE_NOT_FOUND;

    }


    // Mongoose validation
    else if (
        err.name ===
        "ValidationError"
    ) {

        statusCode = 400;

        message =
            Object.values(
                err.errors
            )
                .map(
                    error =>
                        error.message
                )
                .join(", ");

    }


    // MongoDB duplicate key
    else if (
        err.code === 11000
    ) {

        statusCode = 409;

        const field =
            Object.keys(
                err.keyValue || {}
            )[0];


        message =
            field
                ? `${field} already exists`
                : "Resource already exists";

    }


    // JWT
    else if (
        err.name ===
        "JsonWebTokenError"
    ) {

        statusCode = 401;

        message =
            MESSAGES.COMMON
                .INVALID_TOKEN;

    }


    else if (
        err.name ===
        "TokenExpiredError"
    ) {

        statusCode = 401;

        message =
            MESSAGES.COMMON
                .TOKEN_EXPIRED;

    }


    /*
     * Plain Error objects thrown intentionally
     * by our business/service layer.
     */
    else if (
        statusCode === 500 &&
        err.name === "Error"
    ) {

        if (
            /not found/i.test(
                message
            )
        ) {

            statusCode = 404;

        } else if (
            /not authorized|not authorised|administrator access|required admin/i
                .test(message)
        ) {

            statusCode = 403;

        } else {

            statusCode = 400;

        }

    }


    return res
        .status(statusCode)
        .json({

            success: false,

            message,

            stack:
                process.env.NODE_ENV ===
                "production"
                    ? undefined
                    : err.stack,

        });

};


module.exports =
    errorHandler;