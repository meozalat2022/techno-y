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
                style:
                    "currency",
                currency:
                    "EGP",
                maximumFractionDigits:
                    2,
            }
        ).format(
            Number(value) ||
            0
        );


const formatDate =
    value => {

        if (!value) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                dateStyle:
                    "medium",
                timeStyle:
                    "short",
            }
        ).format(
            new Date(value)
        );

    };


export default function PurchaseDetailsModal({
    open,
    purchase,
    onClose,
}) {

    if (
        !open ||
        !purchase
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
                    max-h-[92vh]
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
                            "
                        >
                            {
                                ar.purchases
                                    .purchaseDetails
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
                                purchase
                                    .purchaseNumber
                            }
                        </p>

                    </div>


                    <button
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
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

                        <Info
                            label={
                                ar.purchases
                                    .supplier
                            }
                            value={
                                purchase.supplier
                                    ?.name ||
                                "—"
                            }
                        />

                        <Info
                            label={
                                ar.purchases
                                    .status
                            }
                            value={
                                ar.purchases[
                                    purchase.status
                                ] ||
                                purchase.status
                            }
                        />

                        <Info
                            label={
                                ar.purchases
                                    .createdAt
                            }
                            value={
                                formatDate(
                                    purchase.createdAt
                                )
                            }
                        />

                        <Info
                            label={
                                ar.purchases
                                    .receivedAt
                            }
                            value={
                                formatDate(
                                    purchase.receivedAt
                                )
                            }
                        />

                    </div>


                    <div
                        className="
                            mt-6
                            overflow-x-auto
                            rounded-xl
                            border
                            border-slate-200
                        "
                    >

                        <table
                            className="
                                w-full
                                min-w-[950px]
                                text-sm
                            "
                        >

                            <thead
                                className="
                                    bg-slate-50
                                "
                            >

                                <tr>

                                    <Head>
                                        المنتج
                                    </Head>

                                    <Head>
                                        المطلوب
                                    </Head>

                                    <Head>
                                        المستلم
                                    </Head>

                                    <Head>
                                        المرتجع
                                    </Head>

                                    <Head>
                                        تكلفة الوحدة
                                    </Head>

                                    <Head>
                                        الإجمالي
                                    </Head>

                                </tr>

                            </thead>


                            <tbody
                                className="
                                    divide-y
                                "
                            >

                                {
                                    purchase.items.map(
                                        item => (

                                            <tr
                                                key={
                                                    item.product
                                                }
                                            >

                                                <Cell>

                                                    <strong>
                                                        {
                                                            item.title
                                                        }
                                                    </strong>

                                                    <div
                                                        dir="ltr"
                                                        className="
                                                            mt-1
                                                            font-mono
                                                            text-xs
                                                            text-slate-400
                                                        "
                                                    >
                                                        {
                                                            item.sku
                                                        }
                                                    </div>

                                                </Cell>


                                                <Cell>
                                                    {
                                                        item.quantity
                                                    }
                                                </Cell>


                                                <Cell>
                                                    {
                                                        item
                                                            .receivedQuantity
                                                    }
                                                </Cell>


                                                <Cell>
                                                    {
                                                        item
                                                            .returnedQuantity ||
                                                        0
                                                    }
                                                </Cell>


                                                <Cell>
                                                    {
                                                        formatCurrency(
                                                            item
                                                                .pricing
                                                                .unitCost
                                                        )
                                                    }
                                                </Cell>


                                                <Cell>
                                                    {
                                                        formatCurrency(
                                                            item.quantity *
                                                            item
                                                                .pricing
                                                                .unitCost
                                                        )
                                                    }
                                                </Cell>

                                            </tr>

                                        )
                                    )
                                }

                            </tbody>

                        </table>

                    </div>


                    <div
                        className="
                            mt-6
                            mr-auto
                            w-full
                            max-w-sm
                            rounded-xl
                            bg-slate-50
                            p-4
                        "
                    >

                        <TotalRow
                            label="الإجمالي الفرعي"
                            value={
                                purchase
                                    .totals
                                    .subtotal
                            }
                        />

                        <TotalRow
                            label="الخصم"
                            value={
                                purchase
                                    .totals
                                    .discount
                            }
                        />

                        <TotalRow
                            label="الشحن"
                            value={
                                purchase
                                    .totals
                                    .shipping
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
                                label="الإجمالي"
                                value={
                                    purchase
                                        .totals
                                        .total
                                }
                                strong
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


function Info({
    label,
    value,
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
                className="
                    mt-2
                    font-semibold
                    text-slate-900
                "
            >
                {value}
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
                        ? "font-bold text-slate-900"
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