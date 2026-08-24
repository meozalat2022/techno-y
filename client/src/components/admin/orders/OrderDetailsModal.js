"use client";


import {
    X,
} from "lucide-react";

import ar from
    "@/locales/ar";


const formatCurrency =
    value =>
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


const formatDate =
    value => {

        if (!value) {
            return "—";
        }


        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        ).format(
            new Date(value)
        );

    };


export default function OrderDetailsModal({
    open,
    order,
    onClose,
}) {

    if (
        !open ||
        !order
    ) {

        return null;

    }


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "
        >

            <div
                className="
                    max-h-[94vh]
                    w-full
                    max-w-7xl
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-xl
                "
            >

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        bg-white
                        px-6
                        py-4
                    "
                >

                    <div>

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            {
                                ar.orders
                                    .orderDetails
                            }
                        </h2>


                        <p
                            dir="ltr"
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            {order.orderNumber}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-500
                            hover:bg-slate-100
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                <div className="p-6">

                    <div
                        className="
                            grid
                            gap-4
                            md:grid-cols-3
                        "
                    >

                        <InfoCard
                            label={
                                ar.orders
                                    .orderNumber
                            }
                            value={
                                order.orderNumber
                            }
                            ltr
                        />

                        <InfoCard
                            label={
                                ar.orders.status
                            }
                            value={
                                ar.orders[
                                    order.status
                                ] ||
                                order.status
                            }
                        />

                        <InfoCard
                            label={
                                ar.orders.date
                            }
                            value={
                                formatDate(
                                    order.createdAt
                                )
                            }
                        />

                    </div>


                    <section className="mt-6">

                        <SectionTitle>
                            {
                                ar.orders
                                    .customerDetails
                            }
                        </SectionTitle>


                        <div
                            className="
                                mt-3
                                grid
                                gap-4
                                md:grid-cols-2
                                xl:grid-cols-4
                            "
                        >

                            <InfoCard
                                label="الاسم"
                                value={
                                    `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() ||
                                    "—"
                                }
                            />

                            <InfoCard
                                label={
                                    ar.orders.phone
                                }
                                value={
                                    order.customer
                                        ?.phone ||
                                    "—"
                                }
                                ltr
                            />

                            <InfoCard
                                label={
                                    ar.orders.email
                                }
                                value={
                                    order.customer
                                        ?.email ||
                                    "—"
                                }
                                ltr
                            />

                            <InfoCard
                                label="رقم المستخدم"
                                value={
                                    order.customer
                                        ?.user ||
                                    "—"
                                }
                                ltr
                            />

                        </div>

                    </section>


                    <section className="mt-6">

                        <SectionTitle>
                            {
                                ar.orders
                                    .shippingAddress
                            }
                        </SectionTitle>


                        <div
                            className="
                                mt-3
                                grid
                                gap-4
                                md:grid-cols-2
                                xl:grid-cols-4
                            "
                        >

                            <InfoCard
                                label={
                                    ar.orders
                                        .governorate
                                }
                                value={
                                    order.shippingAddress
                                        ?.governorate ||
                                    "—"
                                }
                            />

                            <InfoCard
                                label={
                                    ar.orders.city
                                }
                                value={
                                    order.shippingAddress
                                        ?.city ||
                                    "—"
                                }
                            />

                            <InfoCard
                                label={
                                    ar.orders.address
                                }
                                value={
                                    order.shippingAddress
                                        ?.address ||
                                    "—"
                                }
                            />

                            <InfoCard
                                label={
                                    ar.orders.landmark
                                }
                                value={
                                    order.shippingAddress
                                        ?.landmark ||
                                    "—"
                                }
                            />

                        </div>

                    </section>


                    <section className="mt-6">

                        <div
                            className="
                                grid
                                gap-6
                                lg:grid-cols-2
                            "
                        >

                            <div>

                                <SectionTitle>
                                    {
                                        ar.orders
                                            .paymentDetails
                                    }
                                </SectionTitle>


                                <div
                                    className="
                                        mt-3
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >

                                    <InfoCard
                                        label={
                                            ar.orders
                                                .paymentMethod
                                        }
                                        value={
                                            ar.orders
                                                .paymentMethods[
                                                order.payment
                                                    ?.method
                                            ] ||
                                            order.payment
                                                ?.method ||
                                            "—"
                                        }
                                    />

                                    <InfoCard
                                        label={
                                            ar.orders
                                                .paymentStatus
                                        }
                                        value={
                                            ar.orders
                                                .paymentStatuses[
                                                order.payment
                                                    ?.status
                                            ] ||
                                            order.payment
                                                ?.status ||
                                            "—"
                                        }
                                    />

                                </div>

                            </div>


                            <div>

                                <SectionTitle>
                                    {
                                        ar.orders
                                            .shippingDetails
                                    }
                                </SectionTitle>


                                <div
                                    className="
                                        mt-3
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >

                                    <InfoCard
                                        label={
                                            ar.orders
                                                .shippingCompany
                                        }
                                        value={
                                            order.shipping
                                                ?.company ||
                                            "—"
                                        }
                                    />

                                    <InfoCard
                                        label={
                                            ar.orders
                                                .shippingMethod
                                        }
                                        value={
                                            order.shipping
                                                ?.method ||
                                            "—"
                                        }
                                    />

                                    <InfoCard
                                        label={
                                            ar.orders
                                                .trackingNumber
                                        }
                                        value={
                                            order.shipping
                                                ?.trackingNumber ||
                                            "—"
                                        }
                                        ltr
                                    />

                                    <InfoCard
                                        label={
                                            ar.orders.shipping
                                        }
                                        value={
                                            formatCurrency(
                                                order.shipping
                                                    ?.cost
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    </section>


                    <section className="mt-7">

                        <SectionTitle>
                            {
                                ar.orders.products
                            }
                        </SectionTitle>


                        <div
                            className="
                                mt-3
                                overflow-x-auto
                                rounded-xl
                                border
                                border-slate-200
                            "
                        >

                            <table
                                className="
                                    w-full
                                    min-w-[1000px]
                                    text-sm
                                "
                            >

                                <thead
                                    className="
                                        bg-slate-50
                                        text-slate-500
                                    "
                                >

                                    <tr>

                                        <Head>
                                            المنتج
                                        </Head>

                                        <Head>
                                            SKU
                                        </Head>

                                        <Head>
                                            الكمية
                                        </Head>

                                        <Head>
                                            المرتجع
                                        </Head>

                                        <Head>
                                            سعر الوحدة
                                        </Head>

                                        <Head>
                                            الإجمالي
                                        </Head>

                                    </tr>

                                </thead>


                                <tbody
                                    className="
                                        divide-y
                                        divide-slate-100
                                    "
                                >

                                    {
                                        order.items?.map(
                                            item => (

                                                <tr
                                                    key={
                                                        item.product
                                                    }
                                                >

                                                    <Cell>

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-3
                                                            "
                                                        >

                                                            {
                                                                item.image
                                                                    ?.url
                                                                    ? (

                                                                        <img
                                                                            src={
                                                                                item.image.url
                                                                            }
                                                                            alt=""
                                                                            className="
                                                                                h-12
                                                                                w-12
                                                                                rounded-lg
                                                                                border
                                                                                object-cover
                                                                            "
                                                                        />

                                                                    )
                                                                    : (

                                                                        <div
                                                                            className="
                                                                                h-12
                                                                                w-12
                                                                                rounded-lg
                                                                                bg-slate-100
                                                                            "
                                                                        />

                                                                    )
                                                            }


                                                            <div>

                                                                <div
                                                                    className="
                                                                        font-semibold
                                                                        text-slate-900
                                                                    "
                                                                >
                                                                    {
                                                                        item.title
                                                                    }
                                                                </div>


                                                                <div
                                                                    className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    {
                                                                        item.brand
                                                                    }
                                                                    {" — "}
                                                                    {
                                                                        item.category
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </Cell>


                                                    <Cell>

                                                        <span
                                                            dir="ltr"
                                                            className="
                                                                font-mono
                                                                text-xs
                                                            "
                                                        >
                                                            {item.sku}
                                                        </span>

                                                    </Cell>


                                                    <Cell>
                                                        {
                                                            item.quantity
                                                        }
                                                    </Cell>


                                                    <Cell>
                                                        {
                                                            item.returnedQuantity ||
                                                            0
                                                        }
                                                    </Cell>


                                                    <Cell>
                                                        {
                                                            formatCurrency(
                                                                item.pricing
                                                                    ?.finalPrice
                                                            )
                                                        }
                                                    </Cell>


                                                    <Cell>

                                                        <strong
                                                            className="
                                                                text-slate-900
                                                            "
                                                        >
                                                            {
                                                                formatCurrency(
                                                                    (
                                                                        item.pricing
                                                                            ?.finalPrice ||
                                                                        0
                                                                    ) *
                                                                    item.quantity
                                                                )
                                                            }
                                                        </strong>

                                                    </Cell>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    </section>


                    <div
                        className="
                            mt-6
                            grid
                            gap-6
                            lg:grid-cols-2
                        "
                    >

                        <div>

                            <SectionTitle>
                                الملاحظات
                            </SectionTitle>


                            <div
                                className="
                                    mt-3
                                    space-y-3
                                "
                            >

                                <NoteBox
                                    label={
                                        ar.orders
                                            .customerNotes
                                    }
                                    value={
                                        order.notes
                                            ?.customer
                                    }
                                />

                                <NoteBox
                                    label={
                                        ar.orders
                                            .adminNotes
                                    }
                                    value={
                                        order.notes
                                            ?.admin
                                    }
                                />

                            </div>

                        </div>


                        <div
                            className="
                                rounded-xl
                                bg-slate-50
                                p-5
                            "
                        >

                            <TotalRow
                                label={
                                    ar.orders
                                        .subtotal
                                }
                                value={
                                    order.totals
                                        ?.subtotal
                                }
                            />

                            <TotalRow
                                label={
                                    ar.orders
                                        .discount
                                }
                                value={
                                    order.totals
                                        ?.discount
                                }
                            />

                            <TotalRow
                                label={
                                    ar.orders.shipping
                                }
                                value={
                                    order.totals
                                        ?.shipping
                                }
                            />


                            <div
                                className="
                                    mt-3
                                    border-t
                                    border-slate-200
                                    pt-3
                                "
                            >

                                <TotalRow
                                    label={
                                        ar.orders
                                            .finalTotal
                                    }
                                    value={
                                        order.totals
                                            ?.total
                                    }
                                    strong
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


function SectionTitle({
    children,
}) {

    return (

        <h3
            className="
                text-base
                font-bold
                text-slate-900
            "
        >
            {children}
        </h3>

    );

}


function InfoCard({
    label,
    value,
    ltr = false,
}) {

    return (

        <div
            className="
                rounded-xl
                bg-slate-50
                p-4
            "
        >

            <div
                className="
                    text-xs
                    text-slate-500
                "
            >
                {label}
            </div>


            <div
                dir={
                    ltr
                        ? "ltr"
                        : undefined
                }
                className="
                    mt-2
                    break-words
                    text-sm
                    font-semibold
                    text-slate-900
                "
            >
                {value}
            </div>

        </div>

    );

}


function NoteBox({
    label,
    value,
}) {

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-200
                p-4
            "
        >

            <div
                className="
                    text-xs
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </div>


            <div
                className="
                    mt-2
                    whitespace-pre-wrap
                    text-sm
                    leading-6
                    text-slate-700
                "
            >
                {value || "—"}
            </div>

        </div>

    );

}


function TotalRow({
    label,
    value,
    strong = false,
}) {

    return (

        <div
            className="
                flex
                justify-between
                gap-4
                py-1.5
            "
        >

            <span
                className="
                    text-sm
                    text-slate-500
                "
            >
                {label}
            </span>


            <span
                className={
                    strong
                        ? "text-lg font-bold text-slate-900"
                        : "text-sm font-medium text-slate-700"
                }
            >
                {
                    formatCurrency(
                        value
                    )
                }
            </span>

        </div>

    );

}


function Head({
    children,
}) {

    return (

        <th
            className="
                whitespace-nowrap
                px-4
                py-3
                text-right
                text-xs
                font-semibold
            "
        >
            {children}
        </th>

    );

}


function Cell({
    children,
}) {

    return (

        <td
            className="
                px-4
                py-4
                text-slate-600
            "
        >
            {children}
        </td>

    );

}