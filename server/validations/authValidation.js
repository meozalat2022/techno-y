const { body } =
    require("express-validator");

const egyptMobileRegex =
    /^(?:\+20|0)1[0125]\d{8}$/;

const registerValidation = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "First name must be between 2 and 50 characters."
        ),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "Last name must be between 2 and 50 characters."
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage(
            "A valid email address is required."
        )
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage("Email is too long."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .matches(egyptMobileRegex)
        .withMessage(
            "Enter a valid Egyptian mobile number."
        ),

    body("password")
        .isString()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 128 })
        .withMessage(
            "Password must be between 8 and 128 characters."
        ),
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage(
            "A valid email address is required."
        )
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage("Email is too long."),

    body("password")
        .isString()
        .withMessage("Password is required.")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ max: 128 })
        .withMessage("Password is too long."),
];

const forgotPasswordValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage(
            "A valid email address is required."
        )
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage("Email is too long."),
];

const resetPasswordValidation = [
    body("token")
        .isString()
        .withMessage("Reset token is required.")
        .notEmpty()
        .withMessage("Reset token is required."),

    body("password")
        .isString()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 128 })
        .withMessage(
            "Password must be between 8 and 128 characters."
        ),
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
};
