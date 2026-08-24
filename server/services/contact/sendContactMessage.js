const nodemailer =
    require("nodemailer");


const escapeHtml = (value = "") => {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

};


const sendContactMessage = async ({
    name,
    phone,
    email,
    subject,
    message,
}) => {

    const transporter =
        nodemailer.createTransport({

            host:
                process.env.MAIL_HOST,

            port:
                Number(
                    process.env.MAIL_PORT
                ) || 587,

            secure:
                false,

            auth: {

                user:
                    process.env.MAIL_USER,

                pass:
                    process.env.MAIL_PASS,

            },

        });


    const safeName =
        escapeHtml(name);

    const safePhone =
        escapeHtml(phone);

    const safeEmail =
        escapeHtml(email || "");

    const safeSubject =
        escapeHtml(subject);

    const safeMessage =
        escapeHtml(message)
            .replaceAll(
                "\n",
                "<br />"
            );


    await transporter.sendMail({

        from:
            `"Techno-Y Website" <${process.env.MAIL_USER}>`,

        to:
            process.env.MAIL_TO,

        replyTo:
            email || undefined,

        subject:
            `رسالة جديدة من موقع تكنو-واي - ${subject}`,

        text: `
رسالة جديدة من نموذج التواصل في موقع تكنو-واي

الاسم:
${name}

رقم الهاتف:
${phone}

البريد الإلكتروني:
${email || "غير مذكور"}

الموضوع:
${subject}

الرسالة:
${message}
        `.trim(),

        html: `
            <div
                dir="rtl"
                style="
                    font-family: Arial, sans-serif;
                    max-width: 650px;
                    margin: auto;
                    line-height: 1.8;
                "
            >

                <h2>
                    رسالة جديدة من موقع تكنو-واي
                </h2>

                <hr />

                <p>
                    <strong>الاسم:</strong>
                    ${safeName}
                </p>

                <p>
                    <strong>رقم الهاتف:</strong>
                    ${safePhone}
                </p>

                <p>
                    <strong>البريد الإلكتروني:</strong>
                    ${
                        safeEmail ||
                        "غير مذكور"
                    }
                </p>

                <p>
                    <strong>الموضوع:</strong>
                    ${safeSubject}
                </p>

                <div
                    style="
                        margin-top: 20px;
                        padding: 16px;
                        background: #f5f5f5;
                        border-radius: 8px;
                    "
                >
                    <strong>الرسالة:</strong>

                    <div
                        style="
                            margin-top: 10px;
                        "
                    >
                        ${safeMessage}
                    </div>
                </div>

            </div>
        `,

    });


    return true;

};


module.exports =
    sendContactMessage;