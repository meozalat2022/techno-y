const requireValue = (
    name,
    missing
) => {

    const value =
        process.env[name]
            ?.trim();


    if (!value) {

        missing.push(
            name
        );

    }


    return value;

};


const assertHttpsUrl = (
    name,
    value,
    errors
) => {

    if (
        !value
    ) {
        return;
    }


    try {

        const url =
            new URL(
                value
            );


        if (
            url.protocol !==
            "https:"
        ) {

            errors.push(
                `${name} must use https in production`
            );

        }

    } catch {

        errors.push(
            `${name} must be a valid URL`
        );

    }

};


const validateEnv = () => {

    const missing =
        [];

    const errors =
        [];


    [
        "CLIENT_URL",
        "MONGO_URI",
        "JWT_SECRET",

        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",

        "MAIL_HOST",
        "MAIL_PORT",
        "MAIL_USER",
        "MAIL_PASS",
        "MAIL_TO",

        "OPAY_MODE",
        "OPAY_RETURN_URL",
        "OPAY_CANCEL_URL",
        "OPAY_CALLBACK_URL",
    ].forEach(
        name =>
            requireValue(
                name,
                missing
            )
    );


    const opayMode =
        process.env
            .OPAY_MODE
            ?.trim()
            .toLowerCase();


    if (
        opayMode &&
        ![
            "test",
            "live",
        ].includes(
            opayMode
        )
    ) {

        errors.push(
            "OPAY_MODE must be either test or live"
        );

    }


    const opayPrefix =
        opayMode ===
        "live"
            ? "OPAY_LIVE"
            : "OPAY_TEST";


    [
        `${opayPrefix}_MERCHANT_ID`,
        `${opayPrefix}_PUBLIC_KEY`,
        `${opayPrefix}_SECRET_KEY`,
    ].forEach(
        name =>
            requireValue(
                name,
                missing
            )
    );


    const jwtSecret =
        process.env
            .JWT_SECRET ||
        "";


    if (
        jwtSecret &&
        jwtSecret.length <
            32
    ) {

        errors.push(
            "JWT_SECRET must be at least 32 characters long"
        );

    }


    const expiryMinutes =
        Number(
            process.env
                .OPAY_PENDING_EXPIRY_MINUTES ||
            30
        );


    if (
        !Number.isFinite(
            expiryMinutes
        ) ||
        expiryMinutes <=
            0
    ) {

        errors.push(
            "OPAY_PENDING_EXPIRY_MINUTES must be a positive number"
        );

    }


    const checkIntervalMinutes =
        Number(
            process.env
                .OPAY_PENDING_EXPIRY_CHECK_INTERVAL_MINUTES ||
            5
        );


    if (
        !Number.isFinite(
            checkIntervalMinutes
        ) ||
        checkIntervalMinutes <=
            0
    ) {

        errors.push(
            "OPAY_PENDING_EXPIRY_CHECK_INTERVAL_MINUTES must be a positive number"
        );

    }


    if (
        process.env
            .NODE_ENV ===
        "production"
    ) {

        if (
            opayMode !==
            "live"
        ) {

            errors.push(
                "OPAY_MODE must be live when NODE_ENV=production"
            );

        }


        [
            "CLIENT_URL",
            "OPAY_RETURN_URL",
            "OPAY_CANCEL_URL",
            "OPAY_CALLBACK_URL",
        ].forEach(
            name =>
                assertHttpsUrl(
                    name,
                    process.env[
                        name
                    ],
                    errors
                )
        );

    }


    if (
        missing.length >
        0 ||
        errors.length >
        0
    ) {

        const parts =
            [];


        if (
            missing.length >
            0
        ) {

            parts.push(
                `Missing environment variables: ${[
                    ...new Set(
                        missing
                    ),
                ].join(", ")}`
            );

        }


        if (
            errors.length >
            0
        ) {

            parts.push(
                `Environment configuration errors: ${errors.join("; ")}`
            );

        }


        throw new Error(
            parts.join(
                " | "
            )
        );

    }

};


module.exports =
    validateEnv;
