const nodemailer =
    require("nodemailer");

const Notification =
    require("../models/Notification");


const escapeHtml = (value = "") =>
    String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");


const formatCurrency = value =>
    new Intl.NumberFormat(
        "ar-EG",
        {
            style: "currency",
            currency: "EGP",
            maximumFractionDigits: 2,
        }
    ).format(
        Number(value) || 0
    );


const formatDate = value =>
    new Intl.DateTimeFormat(
        "ar-EG",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(
        new Date(value || Date.now())
    );


const createTransporter = () =>
    nodemailer.createTransport({
        host:
            process.env.MAIL_HOST,
        port:
            Number(
                process.env.MAIL_PORT
            ) || 587,
        secure: false,
        auth: {
            user:
                process.env.MAIL_USER,
            pass:
                process.env.MAIL_PASS,
        },
    });


const orderItemsHtml = items =>
    (Array.isArray(items) ? items : [])
        .map(item => `
            <tr
                dir="rtl"
                style="
                    direction:rtl;
                    text-align:right;
                "
            >
                <td
                    dir="rtl"
                    align="right"
                    style="
                        padding:10px;
                        border-bottom:1px solid #e5e7eb;
                        text-align:right;
                        direction:rtl;
                    "
                >
                    ${escapeHtml(item.title)}

                    ${
                        item.sku
                            ? `
                                <div
                                    dir="rtl"
                                    style="
                                        font-size:12px;
                                        color:#64748b;
                                        direction:rtl;
                                        text-align:right;
                                    "
                                >
                                    SKU: ${escapeHtml(item.sku)}
                                </div>
                            `
                            : ""
                    }
                </td>

                <td
                    dir="rtl"
                    align="center"
                    style="
                        padding:10px;
                        text-align:center;
                        border-bottom:1px solid #e5e7eb;
                        direction:rtl;
                    "
                >
                    ${Number(item.quantity) || 0}
                </td>

                <td
                    dir="rtl"
                    align="right"
                    style="
                        padding:10px;
                        text-align:right;
                        border-bottom:1px solid #e5e7eb;
                        direction:rtl;
                    "
                >
                    ${formatCurrency(
                        item.pricing?.finalPrice ??
                        item.unitPrice
                    )}
                </td>
            </tr>
        `)
        .join("");


const returnItemsHtml = items =>
    (Array.isArray(items) ? items : [])
        .map(item => `
            <tr
                dir="rtl"
                style="
                    direction:rtl;
                    text-align:right;
                "
            >
                <td
                    dir="rtl"
                    align="right"
                    style="
                        padding:10px;
                        border-bottom:1px solid #e5e7eb;
                        text-align:right;
                        direction:rtl;
                    "
                >
                    ${escapeHtml(item.title)}

                    ${
                        item.sku
                            ? `
                                <div
                                    dir="rtl"
                                    style="
                                        font-size:12px;
                                        color:#64748b;
                                        direction:rtl;
                                        text-align:right;
                                    "
                                >
                                    SKU: ${escapeHtml(item.sku)}
                                </div>
                            `
                            : ""
                    }
                </td>

                <td
                    dir="rtl"
                    align="center"
                    style="
                        padding:10px;
                        text-align:center;
                        border-bottom:1px solid #e5e7eb;
                        direction:rtl;
                    "
                >
                    ${Number(item.quantity) || 0}
                </td>

                <td
                    dir="rtl"
                    align="right"
                    style="
                        padding:10px;
                        text-align:right;
                        border-bottom:1px solid #e5e7eb;
                        direction:rtl;
                    "
                >
                    ${formatCurrency(item.unitPrice)}
                </td>
            </tr>
        `)
        .join("");


const emailLayout = ({
    title,
    intro,
    content,
    buttonText,
    buttonUrl,
}) => `
<!doctype html>

<html
    lang="ar"
    dir="rtl"
    style="
        direction:rtl;
        text-align:right;
    "
>
<head>
    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width,initial-scale=1"
    />

    <meta
        http-equiv="Content-Type"
        content="text/html; charset=UTF-8"
    />

    <title>Techno-Y</title>

    <style>
        html,
        body {
            direction: rtl !important;
            text-align: right !important;
        }

        body,
        table,
        td,
        div,
        p,
        h1,
        h2,
        h3,
        h4 {
            direction: rtl;
        }

        table {
            direction: rtl;
        }

        th,
        td {
            direction: rtl;
        }

        .rtl {
            direction: rtl !important;
            text-align: right !important;
        }

        .center {
            text-align: center !important;
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }

            .email-content {
                padding: 18px !important;
            }

            .email-header {
                padding: 18px !important;
            }

            .email-footer {
                padding: 14px 18px !important;
            }
        }
    </style>
</head>

<body
    dir="rtl"
    style="
        margin:0;
        padding:0;
        width:100%;
        background:#f1f5f9;
        font-family:Arial,Tahoma,sans-serif;
        color:#0f172a;
        direction:rtl !important;
        text-align:right !important;
    "
>

    <!-- Outer wrapper -->
    <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        dir="rtl"
        style="
            width:100%;
            direction:rtl;
            background:#f1f5f9;
            border-collapse:collapse;
        "
    >
        <tr dir="rtl">
            <td
                dir="rtl"
                align="center"
                style="
                    padding:24px 12px;
                    direction:rtl;
                    text-align:center;
                "
            >

                <!-- Main container -->
                <table
                    role="presentation"
                    width="700"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    dir="rtl"
                    class="email-container"
                    style="
                        width:100%;
                        max-width:700px;
                        background:#ffffff;
                        border:1px solid #e2e8f0;
                        border-radius:12px;
                        overflow:hidden;
                        direction:rtl;
                        text-align:right;
                        border-collapse:separate;
                    "
                >

                    <!-- Header -->
                    <tr dir="rtl">
                        <td
                            dir="rtl"
                            align="right"
                            class="email-header"
                            style="
                                padding:22px 24px;
                                background:#0f172a;
                                color:#ffffff;
                                direction:rtl;
                                text-align:right;
                            "
                        >
                            <div
                                dir="rtl"
                                style="
                                    font-size:20px;
                                    font-weight:700;
                                    direction:rtl;
                                    text-align:right;
                                "
                            >
                                تكنو-واي
                            </div>

                            <div
                                dir="rtl"
                                style="
                                    font-size:13px;
                                    opacity:.8;
                                    margin-top:4px;
                                    direction:rtl;
                                    text-align:right;
                                "
                            >
                                راحة بيتك
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr dir="rtl">
                        <td
                            dir="rtl"
                            align="right"
                            class="email-content"
                            style="
                                padding:24px;
                                direction:rtl;
                                text-align:right;
                            "
                        >

                            <h1
                                dir="rtl"
                                style="
                                    font-size:22px;
                                    margin:0 0 10px;
                                    direction:rtl;
                                    text-align:right;
                                "
                            >
                                ${title}
                            </h1>

                            <p
                                dir="rtl"
                                style="
                                    font-size:15px;
                                    line-height:1.9;
                                    margin:0 0 20px;
                                    direction:rtl;
                                    text-align:right;
                                "
                            >
                                ${intro}
                            </p>

                            <div
                                dir="rtl"
                                style="
                                    direction:rtl;
                                    text-align:right;
                                "
                            >
                                ${content}
                            </div>

                            ${
                                buttonUrl
                                    ? `
                                        <div
                                            dir="rtl"
                                            align="center"
                                            style="
                                                direction:rtl;
                                                text-align:center;
                                                margin-top:26px;
                                            "
                                        >
                                            <a
                                                href="${escapeHtml(buttonUrl)}"
                                                dir="rtl"
                                                style="
                                                    display:inline-block;
                                                    background:#0f172a;
                                                    color:#ffffff;
                                                    text-decoration:none;
                                                    padding:12px 22px;
                                                    border-radius:8px;
                                                    font-weight:700;
                                                    direction:rtl;
                                                    text-align:center;
                                                "
                                            >
                                                ${escapeHtml(
                                                    buttonText ||
                                                    "عرض التفاصيل"
                                                )}
                                            </a>
                                        </div>
                                    `
                                    : ""
                            }

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr dir="rtl">
                        <td
                            dir="rtl"
                            align="center"
                            class="email-footer"
                            style="
                                padding:16px 24px;
                                background:#f8fafc;
                                color:#64748b;
                                font-size:12px;
                                direction:rtl;
                                text-align:center;
                            "
                        >
                            هذا البريد مرسل تلقائيًا من نظام إدارة متجر تكنو-واي.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`;


const sendEmail = async ({
    subject,
    html,
    text,
}) => {

    if (
        !process.env.MAIL_HOST ||
        !process.env.MAIL_USER ||
        !process.env.MAIL_PASS ||
        !process.env.MAIL_TO
    ) {
        throw new Error(
            "Mail configuration is incomplete."
        );
    }


    const transporter =
        createTransporter();


    await transporter.sendMail({
        from:
            `"Techno-Y" <${process.env.MAIL_USER}>`,
        to:
            process.env.MAIL_TO,
        subject,
        text,
        html,
    });
};


const createDashboardNotification = async ({
    type,
    title,
    message,
    order,
    customerReturn,
    link,
}) => {

    return Notification.create({
        type,
        title,
        message,
        orderId:
            order?._id || null,
        orderNumber:
            order?.orderNumber ||
            customerReturn?.orderNumber ||
            "",
        returnId:
            customerReturn?._id || null,
        returnNumber:
            customerReturn?.returnNumber ||
            "",
        link: link || "",
    });
};


const notifyOrderCreated = async order => {

    const title =
        `طلب جديد #${order.orderNumber}`;

    const message =
        `تم استلام طلب جديد بقيمة ${formatCurrency(order.totals?.total)}.`;


    const dashboardPromise =
        createDashboardNotification({
            type:
                Notification.TYPES
                    .ORDER_CREATED,
            title,
            message,
            order,
            link:
                `/admin/orders`,
        });


    const customerName =
        [
            order.customer?.firstName,
            order.customer?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "غير مذكور";


    const shippingAddress =
        order.shippingAddress || {};


    const emailContent = `
        <div
            dir="rtl"
            style="
                background:#f8fafc;
                padding:16px;
                border-radius:10px;
                margin-bottom:18px;
                direction:rtl;
                text-align:right;
            "
        >
            <p dir="rtl" style="margin:0 0 7px;text-align:right;direction:rtl;">
                <strong>رقم الطلب:</strong>
                ${escapeHtml(order.orderNumber)}
            </p>

            <p dir="rtl" style="margin:0 0 7px;text-align:right;direction:rtl;">
                <strong>تاريخ الطلب:</strong>
                ${formatDate(order.createdAt)}
            </p>

            <p dir="rtl" style="margin:0 0 7px;text-align:right;direction:rtl;">
                <strong>العميل:</strong>
                ${escapeHtml(customerName)}
            </p>

            <p dir="rtl" style="margin:0 0 7px;text-align:right;direction:rtl;">
                <strong>الهاتف:</strong>
                ${escapeHtml(
                    order.customer?.phone ||
                    "غير مذكور"
                )}
            </p>

            <p dir="rtl" style="margin:0;text-align:right;direction:rtl;">
                <strong>البريد:</strong>
                ${escapeHtml(
                    order.customer?.email ||
                    "غير مذكور"
                )}
            </p>
        </div>

        <h3
            dir="rtl"
            style="
                margin:20px 0 10px;
                direction:rtl;
                text-align:right;
            "
        >
            المنتجات
        </h3>

        <div
            dir="rtl"
            style="
                overflow-x:auto;
                direction:rtl;
                text-align:right;
            "
        >
            <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                dir="rtl"
                style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:14px;
                    direction:rtl;
                    text-align:right;
                "
            >
                <thead>
                    <tr
                        dir="rtl"
                        style="
                            background:#f8fafc;
                            direction:rtl;
                        "
                    >
                        <th
                            dir="rtl"
                            align="right"
                            style="
                                padding:10px;
                                text-align:right;
                                direction:rtl;
                            "
                        >
                            المنتج
                        </th>

                        <th
                            dir="rtl"
                            align="center"
                            style="
                                padding:10px;
                                text-align:center;
                                direction:rtl;
                            "
                        >
                            الكمية
                        </th>

                        <th
                            dir="rtl"
                            align="right"
                            style="
                                padding:10px;
                                text-align:right;
                                direction:rtl;
                            "
                        >
                            السعر
                        </th>
                    </tr>
                </thead>

                <tbody dir="rtl">
                    ${orderItemsHtml(order.items)}
                </tbody>
            </table>
        </div>

        <div
            dir="rtl"
            style="
                margin-top:18px;
                background:#f8fafc;
                padding:16px;
                border-radius:10px;
                direction:rtl;
                text-align:right;
            "
        >
            <p dir="rtl" style="margin:0 0 7px;text-align:right;direction:rtl;">
                <strong>المجموع الفرعي:</strong>
                ${formatCurrency(order.totals?.subtotal)}
            </p>

            <p dir="rtl" style="margin:0 0 7px;text-align:right;direction:rtl;">
                <strong>الخصم:</strong>
                ${formatCurrency(order.totals?.discount)}
            </p>

            <p dir="rtl" style="margin:0 0 7px;text-align:right;direction:rtl;">
                <strong>الشحن:</strong>
                ${formatCurrency(order.totals?.shipping)}
            </p>

            <p
                dir="rtl"
                style="
                    margin:0;
                    font-size:18px;
                    text-align:right;
                    direction:rtl;
                "
            >
                <strong>الإجمالي:</strong>
                ${formatCurrency(order.totals?.total)}
            </p>
        </div>

        <h3
            dir="rtl"
            style="
                margin:20px 0 10px;
                direction:rtl;
                text-align:right;
            "
        >
            بيانات الشحن
        </h3>

        <div
            dir="rtl"
            style="
                background:#f8fafc;
                padding:16px;
                border-radius:10px;
                line-height:1.9;
                direction:rtl;
                text-align:right;
            "
        >
            ${escapeHtml(customerName)}<br />

            ${escapeHtml(
                shippingAddress.address ||
                shippingAddress.street ||
                ""
            )}<br />

            ${escapeHtml(
                shippingAddress.city ||
                ""
            )}

            ${
                shippingAddress.governorate
                    ? ` — ${escapeHtml(
                        shippingAddress.governorate
                    )}`
                    : ""
            }

            <br />

            ${escapeHtml(
                shippingAddress.phone ||
                order.customer?.phone ||
                ""
            )}
        </div>
    `;


    const emailPromise =
        sendEmail({
            subject:
                `🛒 Techno-Y — طلب جديد #${order.orderNumber}`,

            text:
                `تم استلام طلب جديد رقم ${order.orderNumber} بقيمة ${formatCurrency(order.totals?.total)} من ${customerName}.`,

            html:
                emailLayout({
                    title:
                        `🛒 طلب جديد #${escapeHtml(
                            order.orderNumber
                        )}`,

                    intro:
                        `تم استلام طلب جديد من ${escapeHtml(
                            customerName
                        )} بقيمة ${formatCurrency(
                            order.totals?.total
                        )}.`,

                    content:
                        emailContent,

                    buttonText:
                        "عرض الطلب في لوحة التحكم",

                    buttonUrl:
                        process.env.CLIENT_URL
                            ? `${process.env.CLIENT_URL}/admin/orders`
                            : "",
                }),
        });


    return Promise.allSettled([
        dashboardPromise,
        emailPromise,
    ]);
};


const notifyOrderCancelled = async order => {

    const title =
        `تم إلغاء الطلب #${order.orderNumber}`;

    const message =
        `تم إلغاء الطلب بقيمة ${formatCurrency(order.totals?.total)}.`;


    const dashboardPromise =
        createDashboardNotification({
            type:
                Notification.TYPES
                    .ORDER_CANCELLED,

            title,
            message,
            order,

            link:
                `/admin/orders`,
        });


    const customerName =
        [
            order.customer?.firstName,
            order.customer?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "غير مذكور";


    const emailPromise =
        sendEmail({
            subject:
                `❌ Techno-Y — تم إلغاء الطلب #${order.orderNumber}`,

            text:
                `تم إلغاء الطلب رقم ${order.orderNumber} للعميل ${customerName}. إجمالي الطلب ${formatCurrency(order.totals?.total)}.`,

            html:
                emailLayout({
                    title:
                        `❌ تم إلغاء الطلب #${escapeHtml(
                            order.orderNumber
                        )}`,

                    intro:
                        `تم إلغاء الطلب للعميل ${escapeHtml(
                            customerName
                        )}.`,

                    content: `
                        <div
                            dir="rtl"
                            style="
                                background:#f8fafc;
                                padding:16px;
                                border-radius:10px;
                                direction:rtl;
                                text-align:right;
                            "
                        >
                            <p
                                dir="rtl"
                                style="
                                    margin:0 0 8px;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>رقم الطلب:</strong>
                                ${escapeHtml(
                                    order.orderNumber
                                )}
                            </p>

                            <p
                                dir="rtl"
                                style="
                                    margin:0 0 8px;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>تاريخ التحديث:</strong>
                                ${formatDate(new Date())}
                            </p>

                            <p
                                dir="rtl"
                                style="
                                    margin:0 0 8px;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>العميل:</strong>
                                ${escapeHtml(
                                    customerName
                                )}
                            </p>

                            <p
                                dir="rtl"
                                style="
                                    margin:0;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>إجمالي الطلب:</strong>
                                ${formatCurrency(
                                    order.totals?.total
                                )}
                            </p>
                        </div>
                    `,

                    buttonText:
                        "عرض الطلب في لوحة التحكم",

                    buttonUrl:
                        process.env.CLIENT_URL
                            ? `${process.env.CLIENT_URL}/admin/orders`
                            : "",
                }),
        });


    return Promise.allSettled([
        dashboardPromise,
        emailPromise,
    ]);
};


const notifyCustomerReturnRequested = async customerReturn => {

    const title =
        `طلب إرجاع جديد #${customerReturn.returnNumber}`;

    const message =
        `تم تقديم طلب إرجاع للطلب #${customerReturn.orderNumber}.`;


    const dashboardPromise =
        createDashboardNotification({
            type:
                Notification.TYPES
                    .CUSTOMER_RETURN_REQUESTED,

            title,
            message,

            customerReturn,

            link:
                `/admin/customer-returns`,
        });


    const itemsTotal =
        (customerReturn.items || [])
            .reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.unitPrice || 0
                    ) *
                    Number(
                        item.quantity || 0
                    ),
                0
            );


    const customerName =
        [
            customerReturn.customer?.firstName,
            customerReturn.customer?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "غير مذكور";


    const emailPromise =
        sendEmail({
            subject:
                `↩️ Techno-Y — طلب إرجاع جديد #${customerReturn.returnNumber}`,

            text:
                `تم تقديم طلب إرجاع رقم ${customerReturn.returnNumber} للطلب ${customerReturn.orderNumber} من العميل ${customerName}.`,

            html:
                emailLayout({
                    title:
                        `↩️ طلب إرجاع جديد #${escapeHtml(
                            customerReturn.returnNumber
                        )}`,

                    intro:
                        `تم تقديم طلب إرجاع للطلب #${escapeHtml(
                            customerReturn.orderNumber
                        )} من العميل ${escapeHtml(
                            customerName
                        )}.`,

                    content: `
                        <div
                            dir="rtl"
                            style="
                                background:#f8fafc;
                                padding:16px;
                                border-radius:10px;
                                margin-bottom:18px;
                                direction:rtl;
                                text-align:right;
                            "
                        >
                            <p
                                dir="rtl"
                                style="
                                    margin:0 0 8px;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>رقم المرتجع:</strong>
                                ${escapeHtml(
                                    customerReturn.returnNumber
                                )}
                            </p>

                            <p
                                dir="rtl"
                                style="
                                    margin:0 0 8px;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>رقم الطلب:</strong>
                                ${escapeHtml(
                                    customerReturn.orderNumber
                                )}
                            </p>

                            <p
                                dir="rtl"
                                style="
                                    margin:0 0 8px;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>السبب:</strong>
                                ${escapeHtml(
                                    customerReturn.reason
                                )}
                            </p>

                            <p
                                dir="rtl"
                                style="
                                    margin:0;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>التاريخ:</strong>
                                ${formatDate(
                                    customerReturn.requestedAt ||
                                    customerReturn.createdAt
                                )}
                            </p>
                        </div>

                        <h3
                            dir="rtl"
                            style="
                                margin:20px 0 10px;
                                direction:rtl;
                                text-align:right;
                            "
                        >
                            المنتجات المرتجعة
                        </h3>

                        <div
                            dir="rtl"
                            style="
                                overflow-x:auto;
                                direction:rtl;
                                text-align:right;
                            "
                        >
                            <table
                                role="presentation"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                dir="rtl"
                                style="
                                    width:100%;
                                    border-collapse:collapse;
                                    font-size:14px;
                                    direction:rtl;
                                    text-align:right;
                                "
                            >
                                <thead>
                                    <tr
                                        dir="rtl"
                                        style="
                                            background:#f8fafc;
                                            direction:rtl;
                                        "
                                    >
                                        <th
                                            dir="rtl"
                                            align="right"
                                            style="
                                                padding:10px;
                                                text-align:right;
                                                direction:rtl;
                                            "
                                        >
                                            المنتج
                                        </th>

                                        <th
                                            dir="rtl"
                                            align="center"
                                            style="
                                                padding:10px;
                                                text-align:center;
                                                direction:rtl;
                                            "
                                        >
                                            الكمية
                                        </th>

                                        <th
                                            dir="rtl"
                                            align="right"
                                            style="
                                                padding:10px;
                                                text-align:right;
                                                direction:rtl;
                                            "
                                        >
                                            السعر
                                        </th>
                                    </tr>
                                </thead>

                                <tbody dir="rtl">
                                    ${returnItemsHtml(
                                        customerReturn.items
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div
                            dir="rtl"
                            style="
                                margin-top:18px;
                                background:#f8fafc;
                                padding:16px;
                                border-radius:10px;
                                direction:rtl;
                                text-align:right;
                            "
                        >
                            <p
                                dir="rtl"
                                style="
                                    margin:0;
                                    text-align:right;
                                    direction:rtl;
                                "
                            >
                                <strong>
                                    قيمة المنتجات المرتجعة:
                                </strong>

                                ${formatCurrency(
                                    itemsTotal
                                )}
                            </p>
                        </div>

                        ${
                            customerReturn.notes
                                ? `
                                    <div
                                        dir="rtl"
                                        style="
                                            margin-top:18px;
                                            background:#fff7ed;
                                            padding:16px;
                                            border-radius:10px;
                                            direction:rtl;
                                            text-align:right;
                                        "
                                    >
                                        <strong>
                                            ملاحظات العميل:
                                        </strong>

                                        <div
                                            dir="rtl"
                                            style="
                                                margin-top:8px;
                                                line-height:1.8;
                                                direction:rtl;
                                                text-align:right;
                                            "
                                        >
                                            ${escapeHtml(
                                                customerReturn.notes
                                            )}
                                        </div>
                                    </div>
                                `
                                : ""
                        }
                    `,

                    buttonText:
                        "عرض المرتجع في لوحة التحكم",

                    buttonUrl:
                        process.env.CLIENT_URL
                            ? `${process.env.CLIENT_URL}/admin/customer-returns`
                            : "",
                }),
        });


    return Promise.allSettled([
        dashboardPromise,
        emailPromise,
    ]);
};


const getNotifications = async ({
    limit = 30,
}) => {

    const safeLimit =
        Math.min(
            Math.max(
                Number(limit) || 30,
                1
            ),
            100
        );


    return Notification.find({})
        .sort({
            createdAt: -1,
        })
        .limit(
            safeLimit
        )
        .lean();
};


const getUnreadCount = async () =>
    Notification.countDocuments({
        read: false,
    });


const markAsRead = async id => {

    return Notification.findByIdAndUpdate(
        id,
        {
            $set: {
                read: true,
            },
        },
        {
            new: true,
        }
    );
};


const markAllAsRead = async () => {

    return Notification.updateMany(
        {
            read: false,
        },
        {
            $set: {
                read: true,
            },
        }
    );
};


module.exports = {
    notifyOrderCreated,
    notifyOrderCancelled,
    notifyCustomerReturnRequested,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};