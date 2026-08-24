"use client";


import {
    useEffect,
    useState,
} from "react";

import {
    X,
} from "lucide-react";

import ar from
    "@/locales/ar";


export default function ReceivePurchaseModal({
    open,
    purchase,
    saving,
    onClose,
    onSubmit,
}) {

    const [
        quantities,
        setQuantities,
    ] =
        useState({});


    useEffect(
        () => {

            if (
                !open ||
                !purchase
            ) {
                return;
            }


            const initial = {};


            purchase.items.forEach(
                item => {

                    initial[
                        item.product
                    ] = "";

                }
            );


            setQuantities(
                initial
            );

        },
        [
            open,
            purchase,
        ]
    );


    if (
        !open ||
        !purchase
    ) {

        return null;

    }


    const handleSubmit =
        event => {

            event.preventDefault();


            const items =
                purchase.items

                    .map(
                        item => ({

                            product:
                                item.product,

                            quantityReceived:
                                Number(
                                    quantities[
                                        item.product
                                    ] ||
                                    0
                                ),

                        })
                    )

                    .filter(
                        item =>
                            item.quantityReceived >
                            0
                    );


            if (
                items.length ===
                0
            ) {
                return;
            }


            onSubmit(
                items
            );

        };


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
                    max-w-4xl
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
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
                                ar.purchases
                                    .receiveTitle
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
                        type="button"
                        onClick={onClose}
                        disabled={saving}
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


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="p-6"
                >

                    <div
                        className="
                            mb-5
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            p-4
                            text-sm
                            text-amber-800
                        "
                    >
                        {
                            ar.purchases
                                .receiveHint
                        }
                    </div>


                    <div
                        className="
                            overflow-x-auto
                        "
                    >

                        <table
                            className="
                                w-full
                                min-w-[720px]
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
                                            ar.purchases
                                                .product
                                        }
                                    </Head>

                                    <Head>
                                        {
                                            ar.purchases
                                                .quantity
                                        }
                                    </Head>

                                    <Head>
                                        {
                                            ar.purchases
                                                .receivedQuantity
                                        }
                                    </Head>

                                    <Head>
                                        {
                                            ar.purchases
                                                .remainingQuantity
                                        }
                                    </Head>

                                    <Head>
                                        استلام الآن
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
                                    purchase.items.map(
                                        item => {

                                            const remaining =
                                                item.quantity -
                                                item.receivedQuantity;


                                            return (

                                                <tr
                                                    key={
                                                        item.product
                                                    }
                                                >

                                                    <Cell>

                                                        <div
                                                            className="
                                                                font-medium
                                                                text-slate-900
                                                            "
                                                        >
                                                            {
                                                                item.title
                                                            }
                                                        </div>

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

                                                        <strong>
                                                            {
                                                                remaining
                                                            }
                                                        </strong>

                                                    </Cell>


                                                    <Cell>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={
                                                                remaining
                                                            }
                                                            step="1"
                                                            disabled={
                                                                remaining ===
                                                                0
                                                            }
                                                            value={
                                                                quantities[
                                                                    item.product
                                                                ] ||
                                                                ""
                                                            }
                                                            onChange={
                                                                event =>
                                                                    setQuantities(
                                                                        previous => ({

                                                                            ...previous,

                                                                            [
                                                                                item.product
                                                                            ]:
                                                                                event.target.value,

                                                                        })
                                                                    )
                                                            }
                                                            className="
                                                                w-28
                                                                rounded-lg
                                                                border
                                                                border-slate-300
                                                                px-3
                                                                py-2
                                                            "
                                                        />

                                                    </Cell>

                                                </tr>

                                            );

                                        }
                                    )
                                }

                            </tbody>

                        </table>

                    </div>


                    <div
                        className="
                            mt-7
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-slate-200
                            pt-5
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                px-5
                                py-2.5
                                text-sm
                            "
                        >
                            {ar.common.cancel}
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                rounded-lg
                                bg-slate-900
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                disabled:opacity-60
                            "
                        >

                            {
                                saving
                                    ? ar.common
                                        .saving
                                    : ar.purchases
                                        .receive
                            }

                        </button>

                    </div>

                </form>

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