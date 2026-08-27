const crypto = require("crypto");

const User = require("../models/User");
const generateToken =
    require("../utils/generateToken");
const asyncHandler =
    require("../middleware/asyncHandler");
const userResponse =
    require("../utils/userResponse");
const sendPasswordResetEmail =
    require("../utils/sendPasswordResetEmail");

const {
    successResponse,
} = require("../utils/apiResponse");

const MESSAGES =
    require("../constants/messages");

const getTokenCookieOptions =
    () => ({
        httpOnly: true,
        secure:
            process.env.NODE_ENV ===
            "production",
        sameSite: "lax",
    });

const setTokenCookie = (
    res,
    token
) => {
    res.cookie(
        "token",
        token,
        {
            ...getTokenCookieOptions(),
            maxAge:
                7 *
                24 *
                60 *
                60 *
                1000,
        }
    );
};

const registerUser =
    asyncHandler(async (req, res) => {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
        } = req.body;

        const existingUser =
            await User.findOne({
                email,
            });

        if (existingUser) {
            res.status(409);
            throw new Error(
                MESSAGES.AUTH
                    .EMAIL_ALREADY_EXISTS
            );
        }

        const user =
            await User.create({
                firstName,
                lastName,
                email,
                phone,
                password,
            });

        const token =
            generateToken(user._id);

        setTokenCookie(
            res,
            token
        );

        return successResponse(
            res,
            userResponse(user),
            MESSAGES.AUTH
                .REGISTER_SUCCESS,
            201
        );
    });

const loginUser =
    asyncHandler(async (req, res) => {
        const {
            email,
            password,
        } = req.body;

        const user =
            await User.findOne({
                email,
                isActive: true,
            });

        if (
            user &&
            await user.matchPassword(
                password
            )
        ) {
            const token =
                generateToken(user._id);

            setTokenCookie(
                res,
                token
            );

            return successResponse(
                res,
                userResponse(user),
                MESSAGES.AUTH
                    .LOGIN_SUCCESS
            );
        }

        res.status(401);

        throw new Error(
            MESSAGES.AUTH
                .INVALID_CREDENTIALS
        );
    });

const logoutUser = (
    req,
    res
) => {
    res.cookie(
        "token",
        "",
        {
            ...getTokenCookieOptions(),
            expires:
                new Date(0),
        }
    );

    return successResponse(
        res,
        null,
        MESSAGES.AUTH
            .LOGOUT_SUCCESS
    );
};

const getCurrentUser =
    asyncHandler(async (req, res) => {
        return successResponse(
            res,
            userResponse(req.user),
            MESSAGES.AUTH
                .CURRENT_USER_RETRIEVED
        );
    });

const forgotPassword =
    asyncHandler(async (req, res) => {
        const genericMessage =
            "إذا كان البريد الإلكتروني مسجلاً لدينا، ستصلك رسالة لإعادة تعيين كلمة المرور.";

        const user =
            await User.findOne({
                email: req.body.email,
                isActive: true,
            });

        if (!user) {
            return successResponse(
                res,
                null,
                genericMessage
            );
        }

        const rawToken =
            crypto
                .randomBytes(32)
                .toString("hex");

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(rawToken)
                .digest("hex");

        user.passwordResetToken =
            hashedToken;

        user.passwordResetExpires =
            new Date(
                Date.now() +
                30 * 60 * 1000
            );

        await user.save({
            validateBeforeSave: false,
        });

        const clientUrl =
            process.env.CLIENT_URL
                .replace(/\/+$/, "");

        const resetUrl =
            `${clientUrl}/account/reset-password?token=${encodeURIComponent(rawToken)}`;

        try {
            await sendPasswordResetEmail({
                email: user.email,
                firstName:
                    user.firstName,
                resetUrl,
            });
        } catch (error) {
            user.passwordResetToken =
                undefined;

            user.passwordResetExpires =
                undefined;

            await user.save({
                validateBeforeSave: false,
            });

            throw error;
        }

        return successResponse(
            res,
            null,
            genericMessage
        );
    });

const resetPassword =
    asyncHandler(async (req, res) => {
        const hashedToken =
            crypto
                .createHash("sha256")
                .update(req.body.token)
                .digest("hex");

        const user =
            await User.findOne({
                passwordResetToken:
                    hashedToken,
                passwordResetExpires: {
                    $gt: new Date(),
                },
                isActive: true,
            }).select(
                "+passwordResetToken +passwordResetExpires"
            );

        if (!user) {
            res.status(400);

            throw new Error(
                "رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته."
            );
        }

        user.password =
            req.body.password;

        user.passwordResetToken =
            undefined;

        user.passwordResetExpires =
            undefined;

        await user.save();

        res.cookie(
            "token",
            "",
            {
                ...getTokenCookieOptions(),
                expires:
                    new Date(0),
            }
        );

        return successResponse(
            res,
            null,
            "تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن."
        );
    });

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
};
