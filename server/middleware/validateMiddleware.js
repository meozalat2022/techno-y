const {
    validationResult,
} = require("express-validator");

const MESSAGES =
    require("../constants/messages");


const validate = (
    req,
    res,
    next
) => {

    const errors =
        validationResult(req);


    if (!errors.isEmpty()) {

        return res
            .status(400)
            .json({

                success: false,

                message:
                    MESSAGES.COMMON
                        .VALIDATION_FAILED,

                errors:
                    errors.array(),

            });

    }


    next();

};


module.exports = validate;