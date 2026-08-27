const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async ({
    email,
    firstName,
    resetUrl,
}) => {
    const transporter =
        nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(
                process.env.MAIL_PORT || 587
            ),
            secure:
                Number(
                    process.env.MAIL_PORT
                ) === 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

    await transporter.sendMail({
        from:
            process.env.MAIL_FROM ||
            `"Techno-Y" <${process.env.MAIL_USER}>`,
        to: email,
        subject:
            "إعادة تعيين كلمة المرور - تكنو-واي",
        text:
            `مرحباً ${firstName || ""}\n\n` +
            `استخدم الرابط التالي لإعادة تعيين كلمة المرور:\n${resetUrl}\n\n` +
            `الرابط صالح لمدة 30 دقيقة. إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة.`,
        html: `
            <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8">
                <h2>إعادة تعيين كلمة المرور</h2>
                <p>مرحباً ${firstName || ""}</p>
                <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في تكنو-واي.</p>
                <p>
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:12px 20px;background:#1F4E5F;color:#fff;text-decoration:none;border-radius:8px">
                        تعيين كلمة مرور جديدة
                    </a>
                </p>
                <p>الرابط صالح لمدة 30 دقيقة فقط.</p>
                <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.</p>
            </div>
        `,
    });
};

module.exports = sendPasswordResetEmail;
