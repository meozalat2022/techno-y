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


export default function SupplierReturnDetailsModal({
    open,
    supplierReturn,
    onClose,
}) {

    if (
        !open ||
        !supplierReturn
    ) {
        return null;
    }


    const total =
        supplierReturn.items
            ?.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    (
                        Number(
                            item.unitCost
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
                                ar.supplierReturns
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
                                supplierReturn
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
                                ar.supplierReturns
                                    .returnNumber
                            }
                            value={
                                supplierReturn
                                    .returnNumber
                            }
                            ltr
                        />


                        <InfoCard
                            label={
                                ar.supplierReturns
                                    .purchaseNumber
                            }
                            value={
                                supplierReturn
                                    .purchaseNumber
                            }
                            ltr
                        />


                        <InfoCard
                            label={
                                ar.supplierReturns
                                    .supplier
                            }
                            value={
                                supplierReturn
                                    .supplier
                                    ?.name ||
                                "—"
                            }
                        />


                        <InfoCard
                            label={
                                ar.supplierReturns
                                    .status
                            }
                            value={
                                ar.supplierReturns[
                                    supplierReturn.status
                                ] ||
                                supplierReturn.status
                            }
                        />

                    </div>


                    <div
                        className="
                            mt-6
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        <InfoCard
                            label={
                                ar.supplierReturns
                                    .requestedAt
                            }
                            value={
                                formatDate(
                                    supplierReturn
                                        .requestedAt
                                )
                            }
                        />


                        <InfoCard
                            label={
                                ar.supplierReturns
                                    .sentAt
                            }
                            value={
                                formatDate(
                                    supplierReturn
                                        .sentAt
                                )
                            }
                        />

                    </div>


                    <div
                        className="
                            mt-6
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        <InfoCard
                            label={
                                ar.supplierReturns
                                    .createdBy
                            }
                            value={
                                formatUser(
                                    supplierReturn
                                        .createdBy
                                )
                            }
                        />


                        <InfoCard
                            label={
                                ar.supplierReturns
                                    .sentBy
                            }
                            value={
                                formatUser(
                                    supplierReturn
                                        .sentBy
                                )
                            }
                        />

                    </div>


                    <div
                        className="
                            mt-6
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        <TextBox
                            label={
                                ar.supplierReturns
                                    .reason
                            }
                            value={
                                supplierReturn.reason
                            }
                        />


                        <TextBox
                            label={
                                ar.supplierReturns
                                    .notes
                            }
                            value={
                                supplierReturn.notes
                            }
                        />

                    </div>


                    <section className="mt-7">

                        <h3
                            className="
                                text-base
                                font-bold
                                text-slate-900
                            "
                        >
                            {
                                ar.supplierReturns
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
                                                ar.supplierReturns
                                                    .product
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.supplierReturns
                                                    .sku
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.supplierReturns
                                                    .quantity
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.supplierReturns
                                                    .unitCost
                                            }
                                        </Head>

                                        <Head>
                                            {
                                                ar.supplierReturns
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
                                        supplierReturn
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
                                                                    item.unitCost
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
                                                                        item.unitCost
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

                </div>

            </div>

        </div>

    );

}


function formatUser(user) {

    if (!user) {
        return "—";
    }


    return (
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        "—"
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


function TextBox({
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