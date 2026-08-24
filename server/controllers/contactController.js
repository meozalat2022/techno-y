const asyncHandler =
    require(
        "../middleware/asyncHandler"
    );

const {
    successResponse,
} =
    require(
        "../utils/apiResponse"
    );

const sendContactMessage =
    require(
        "../services/contact/sendContactMessage"
    );


const contact = asyncHandler(
    async (
        req,
        res
    ) => {

        const {

            name,

            phone,

            email,

            subject,

            message,

            website,

        } = req.body;


        /*
         * Honeypot spam protection.
         * Real users never see this field.
         */
        if (website) {

            return successResponse(
                res,
                null,
                "تم إرسال رسالتك بنجاح."
            );

        }


        if (
            !name ||
            !name.trim()
        ) {

            res.status(400);

            throw new Error(
                "الاسم مطلوب."
            );

        }


        if (
            !phone ||
            !phone.trim()
        ) {

            res.status(400);

            throw new Error(
                "رقم الهاتف مطلوب."
            );

        }


        if (
            !subject ||
            !subject.trim()
        ) {

            res.status(400);

            throw new Error(
                "موضوع الرسالة مطلوب."
            );

        }


        if (
            !message ||
            !message.trim()
        ) {

            res.status(400);

            throw new Error(
                "الرسالة مطلوبة."
            );

        }


        if (
            message.trim().length <
            10
        ) {

            res.status(400);

            throw new Error(
                "يرجى كتابة رسالة أكثر تفصيلاً."
            );

        }


        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(
                    email.trim()
                )
        ) {

            res.status(400);

            throw new Error(
                "البريد الإلكتروني غير صحيح."
            );

        }


        await sendContactMessage({

            name:
                name.trim(),

            phone:
                phone.trim(),

            email:
                email
                    ?.trim() ||
                "",

            subject:
                subject.trim(),

            message:
                message.trim(),

        });


        return successResponse(

            res,

            null,

            "تم إرسال رسالتك بنجاح."

        );

    }
);


module.exports = {
    contact,
};