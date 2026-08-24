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


export default function CustomerReturnDetailsModal({
    open,
    customerReturn,
    onClose,
}) {

    if (
        !open ||
        !customerReturn
    ) {

        return null;

    }


    const customer =
        customerReturn.customer;


    const total =
        customerReturn.items
            ?.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    (
                        Number(
                            item.unitPrice
                        ) || 0
                    ) *
                    (
                        Number(
                            item.quantity
                        ) || 0
                    ),
                0
            ) || 0;


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
                    max-w-6xl
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
                                ar.customerReturns
                                    .returnDetails
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
                            {
                                customerReturn
                                    .returnNumber
                            }
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
                            md:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        <InfoCard
                            label={
                                ar.customerReturns
                                    .returnNumber
                            }
                            value={
                                customerReturn
                                    .returnNumber
                            }
                            ltr
                        />


                        <InfoCard
                            label={
                                ar.customerReturns
                                    .orderNumber
                            }
                            value={
                                customerReturn
                                    .orderNumber
                            }
                            ltr
                        />


                        <InfoCard
                            label={
                                ar.customerReturns
                                    .status
                            }
                            value={
                                ar.customerReturns[
                                    customerReturn
                                        .status
                                ] ||
                                customerReturn
                                    .status
                            }
                        />


                        <InfoCard
                            label={
                                ar.customerReturns
                                    .requestedAt
                            }
                            value={
                                formatDate(
                                    customerReturn
                                        .requestedAt
                                )
                            }
                        />

                    </div>


                    <section className="mt-6">

                        <h3
                            className="
                                text-base
                                font-bold
                                text-slate-900
                            "
                        >
                            {
                                ar.customerReturns
                                    .customerDetails
                            }
                        </h3>


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
                                    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() ||
                                    "—"
                                }
                            />


                            <InfoCard
                                label="الهاتف"
                                value={
                                    customer?.phone ||
                                    "—"
                                }
                                ltr
                            />


                            <InfoCard
                                label="البريد الإلكتروني"
                                value={
                                    customer?.email ||
                                    "—"
                                }
                                ltr
                            />


                            <InfoCard
                                label={
                                    ar.customerReturns
                                        .receivedBy
                                }
                                value={
                                    customerReturn
                                        .receivedBy
                                        ? `${customerReturn.receivedBy.firstName || ""} ${customerReturn.receivedBy.lastName || ""}`.trim() ||
                                        customerReturn.receivedBy.email ||
                                        "—"
                                        : "—"
                                }
                            />

                        </div>

                    </section>


                    <section className="mt-6">

                        <div
                            className="
                                grid
                                gap-4
                                md:grid-cols-2
                            "
                        >

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
                                    {
                                        ar.customerReturns
                                            .reason
                                    }
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
                                    {
                                        customerReturn.reason ||
                                        "—"
                                    }
                                </div>

                            </div>


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
                                    {
                                        ar.customerReturns
                                            .notes
                                    }
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
                                    {
                                        customerReturn.notes ||
                                        "—"
                                    }
                                </div>

                            </div>

                        </div>

                    </section>


                    <section className="mt-7">

                        <h3
                            className="
                                text-base
                                font-bold
                                text-slate-900
                            "
                        >
                            {
                                ar.customerReturns
                                    .products
                            }
                        </h3>


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
                                    min-w-[850px]
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
                                            {
                                                ar.customerReturns
                                                    .product
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.customerReturns
                                                    .sku
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.customerReturns
                                                    .quantity
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.customerReturns
                                                    .unitPrice
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.customerReturns
                                                    .lineTotal
                                            }
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
                                        customerReturn
                                            .items
                                            ?.map(
                                                item => (

                                                    <tr
                                                        key={
                                                            item.product
                                                        }
                                                    >

                                                        <Cell>

                                                            <strong
                                                                className="
                                                                    text-slate-900
                                                                "
                                                            >
                                                                {
                                                                    item.title
                                                                }
                                                            </strong>

                                                        </Cell>


                                                        <Cell>

                                                            <span
                                                                dir="ltr"
                                                                className="
                                                                    font-mono
                                                                    text-xs
                                                                "
                                                            >
                                                                {
                                                                    item.sku
                                                                }
                                                            </span>

                                                        </Cell>


                                                        <Cell>
                                                            {
                                                                item.quantity
                                                            }
                                                        </Cell>


                                                        <Cell>
                                                            {
                                                                formatCurrency(
                                                                    item.unitPrice
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
                                                                        item.quantity *
                                                                        item.unitPrice
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
                            flex
                            justify-end
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-sm
                                rounded-xl
                                bg-slate-50
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <span
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    قيمة الأصناف المرتجعة
                                </span>


                                <strong
                                    className="
                                        text-lg
                                        text-slate-900
                                    "
                                >
                                    {
                                        formatCurrency(
                                            total
                                        )
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>


                    {
                        customerReturn
                            .receivedAt &&
                        (

                            <div
                                className="
                                    mt-6
                                    rounded-xl
                                    bg-emerald-50
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        text-xs
                                        font-medium
                                        text-emerald-700
                                    "
                                >
                                    {
                                        ar.customerReturns
                                            .receivedAt
                                    }
                                </div>


                                <div
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-emerald-900
                                    "
                                >
                                    {
                                        formatDate(
                                            customerReturn
                                                .receivedAt
                                        )
                                    }
                                </div>

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

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