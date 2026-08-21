const jwt =
    require("jsonwebtoken");

const User =
    require("../models/User");

const MESSAGES =
    require("../constants/messages");


const protect = async (
    req,
    res,
    next
) => {

    try {

        let token =
            req.cookies.token;


        const authorization =
            req.headers.authorization;


        if (
            !token &&
            authorization?.startsWith(
                "Bearer "
            )
        ) {

            token =
                authorization
                    .split(" ")[1];

        }


        if (!token) {

            return res
                .status(401)
                .json({

                    success: false,

                    message:
                        MESSAGES.AUTH
                            .NOT_AUTHORIZED,

                });

        }


        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );


        const user =
            await User.findOne({

                _id:
                    decoded.userId,

                isActive:
                    true,

            })
                .select(
                    "-password"
                );


        if (!user) {

            return res
                .status(401)
                .json({

                    success: false,

                    message:
                        MESSAGES.AUTH
                            .NOT_AUTHORIZED,

                });

        }


        req.user =
            user;


        next();

    } catch (error) {

        return res
            .status(401)
            .json({

                success: false,

                message:
                    MESSAGES.AUTH
                        .INVALID_TOKEN,

            });

    }

};


module.exports = {
    protect,
};