const createRateLimiter = ({
    windowMs,
    max,
    message,
}) => {

    const hits =
        new Map();


    const cleanupInterval =
        setInterval(

            () => {

                const now =
                    Date.now();


                for (
                    const [
                        key,
                        entry,
                    ]
                    of hits.entries()
                ) {

                    if (
                        entry.resetAt <=
                        now
                    ) {

                        hits.delete(
                            key
                        );

                    }

                }

            },

            Math.min(
                windowMs,
                60 * 1000
            )

        );


    cleanupInterval.unref?.();


    return (
        req,
        res,
        next
    ) => {

        const now =
            Date.now();


        const key =
            req.ip ||
            req.socket?.remoteAddress ||
            "unknown";


        const existing =
            hits.get(
                key
            );


        if (
            !existing ||
            existing.resetAt <=
                now
        ) {

            hits.set(

                key,

                {

                    count:
                        1,

                    resetAt:
                        now +
                        windowMs,

                }

            );


            return next();

        }


        existing.count +=
            1;


        if (
            existing.count >
            max
        ) {

            const retryAfterSeconds =
                Math.max(

                    1,

                    Math.ceil(

                        (
                            existing.resetAt -
                            now
                        ) /
                        1000

                    )

                );


            res.set(

                "Retry-After",

                String(
                    retryAfterSeconds
                )

            );


            return res
                .status(429)
                .json({

                    success:
                        false,

                    message,

                });

        }


        next();

    };

};


const loginLimiter =
    createRateLimiter({

        windowMs:
            15 * 60 * 1000,

        max:
            10,

        message:
            "Too many login attempts. Please try again later.",

    });


const registerLimiter =
    createRateLimiter({

        windowMs:
            60 * 60 * 1000,

        max:
            10,

        message:
            "Too many registration attempts. Please try again later.",

    });


const contactLimiter =
    createRateLimiter({

        windowMs:
            15 * 60 * 1000,

        max:
            5,

        message:
            "تم إرسال عدد كبير من الرسائل. يرجى المحاولة مرة أخرى لاحقاً.",

    });


const bundleRecommendationLimiter =
    createRateLimiter({

        windowMs:
            60 * 1000,

        max:
            60,

        message:
            "تم إرسال عدد كبير من أحداث توصيات الباندل. يرجى المحاولة لاحقاً.",

    });


const forgotPasswordLimiter =
    createRateLimiter({

        windowMs:
            30 * 60 * 1000,

        max:
            5,

        message:
            "تم إرسال عدد كبير من طلبات إعادة تعيين كلمة المرور. يرجى المحاولة لاحقاً.",

    });


const resetPasswordLimiter =
    createRateLimiter({

        windowMs:
            30 * 60 * 1000,

        max:
            10,

        message:
            "تم إجراء عدد كبير من محاولات إعادة تعيين كلمة المرور. يرجى المحاولة لاحقاً.",

    });


module.exports = {

    loginLimiter,

    registerLimiter,

    contactLimiter,

    bundleRecommendationLimiter,

    forgotPasswordLimiter,

    resetPasswordLimiter,

};