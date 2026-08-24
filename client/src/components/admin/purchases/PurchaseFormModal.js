"use client";


import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Plus,
    Trash2,
    X,
} from "lucide-react";

import ar from
    "@/locales/ar";


const newItem = () => ({
    product: "",
    quantity: 1,
    unitCost: "",
});


export default function PurchaseFormModal({
    open,
    suppliers,
    products,
    saving,
    onClose,
    onSubmit,
}) {

    const [
        supplier,
        setSupplier,
    ] =
        useState("");


    const [
        items,
        setItems,
    ] =
        useState([
            newItem(),
        ]);


    useEffect(
        () => {

            if (!open) {
                return;
            }

            setSupplier("");

            setItems([
                newItem(),
            ]);

        },
        [open]
    );


    const subtotal =
        useMemo(
            () => {

                return items.reduce(
                    (
                        total,
                        item
                    ) => {

                        return (
                            total +
                            (
                                Number(
                                    item.quantity
                                ) || 0
                            ) *
                            (
                                Number(
                                    item.unitCost
                                ) || 0
                            )
                        );

                    },
                    0
                );

            },
            [items]
        );


    if (!open) {
        return null;
    }


    const updateItem = (
        index,
        field,
        value
    ) => {

        setItems(
            previous =>
                previous.map(
                    (
                        item,
                        itemIndex
                    ) =>
                        itemIndex ===
                        index
                            ? {
                                ...item,
                                [field]:
                                    value,
                            }
                            : item
                )
        );

    };


    const addItem = () => {

        setItems(
            previous => [
                ...previous,
                newItem(),
            ]
        );

    };


    const removeItem =
        index => {

            setItems(
                previous =>
                    previous.filter(
                        (
                            _,
                            itemIndex
                        ) =>
                            itemIndex !==
                            index
                    )
            );

        };


    const handleSubmit =
        event => {

            event.preventDefault();


            if (
                items.length ===
                0
            ) {
                return;
            }


            onSubmit({

                supplier,

                items:
                    items.map(
                        item => ({

                            product:
                                item.product,

                            quantity:
                                Number(
                                    item.quantity
                                ),

                            unitCost:
                                Number(
                                    item.unitCost
                                ),

                        })
                    ),

            });

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
                    max-w-5xl
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

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        {
                            ar.purchases
                                .addPurchase
                        }
                    </h2>


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

                    <label
                        className="
                            block
                            max-w-lg
                        "
                    >

                        <span
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                            "
                        >
                            {
                                ar.purchases
                                    .supplier
                            }
                        </span>


                        <select
                            required
                            value={supplier}
                            onChange={
                                event =>
                                    setSupplier(
                                        event
                                            .target
                                            .value
                                    )
                            }
                            className={
                                inputClass
                            }
                        >

                            <option value="">
                                {
                                    ar.purchases
                                        .selectSupplier
                                }
                            </option>

                            {
                                suppliers.map(
                                    supplier => (

                                        <option
                                            key={
                                                supplier._id
                                            }
                                            value={
                                                supplier._id
                                            }
                                        >
                                            {
                                                supplier.name
                                            }
                                        </option>

                                    )
                                )
                            }

                        </select>

                    </label>


                    <div
                        className="
                            mt-7
                            overflow-x-auto
                        "
                    >

                        <table
                            className="
                                w-full
                                min-w-[800px]
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
                                                .unitCost
                                        }
                                    </Head>

                                    <Head>
                                        {
                                            ar.purchases
                                                .lineTotal
                                        }
                                    </Head>

                                    <Head>
                                        —
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
                                    items.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const selectedIds =
                                                new Set(
                                                    items
                                                        .filter(
                                                            (
                                                                _,
                                                                itemIndex
                                                            ) =>
                                                                itemIndex !==
                                                                index
                                                        )
                                                        .map(
                                                            current =>
                                                                current.product
                                                        )
                                                        .filter(
                                                            Boolean
                                                        )
                                                );


                                            return (

                                                <tr key={index}>

                                                    <Cell>

                                                        <select
                                                            required
                                                            value={
                                                                item.product
                                                            }
                                                            onChange={
                                                                event =>
                                                                    updateItem(
                                                                        index,
                                                                        "product",
                                                                        event.target.value
                                                                    )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        >

                                                            <option value="">
                                                                {
                                                                    ar.purchases
                                                                        .selectProduct
                                                                }
                                                            </option>

                                                            {
                                                                products.map(
                                                                    product => (

                                                                        <option
                                                                            key={
                                                                                product._id
                                                                            }
                                                                            value={
                                                                                product._id
                                                                            }
                                                                            disabled={
                                                                                selectedIds.has(
                                                                                    product._id
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                product.title
                                                                            }
                                                                            {" — "}
                                                                            {
                                                                                product.sku
                                                                            }
                                                                        </option>

                                                                    )
                                                                )
                                                            }

                                                        </select>

                                                    </Cell>


                                                    <Cell>

                                                        <input
                                                            required
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={
                                                                event =>
                                                                    updateItem(
                                                                        index,
                                                                        "quantity",
                                                                        event.target.value
                                                                    )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        />

                                                    </Cell>


                                                    <Cell>

                                                        <input
                                                            required
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={
                                                                item.unitCost
                                                            }
                                                            onChange={
                                                                event =>
                                                                    updateItem(
                                                                        index,
                                                                        "unitCost",
                                                                        event.target.value
                                                                    )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        />

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
                                                                        Number(
                                                                            item.quantity
                                                                        ) ||
                                                                        0
                                                                    ) *
                                                                    (
                                                                        Number(
                                                                            item.unitCost
                                                                        ) ||
                                                                        0
                                                                    )
                                                                )
                                                            }
                                                        </strong>

                                                    </Cell>


                                                    <Cell>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                items.length ===
                                                                1
                                                            }
                                                            onClick={
                                                                () =>
                                                                    removeItem(
                                                                        index
                                                                    )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-red-200
                                                                p-2
                                                                text-red-600
                                                                hover:bg-red-50
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-30
                                                            "
                                                        >
                                                            <Trash2
                                                                size={16}
                                                            />
                                                        </button>

                                                    </Cell>

                                                </tr>

                                            );

                                        }
                                    )
                                }

                            </tbody>

                        </table>

                    </div>


                    <button
                        type="button"
                        onClick={addItem}
                        className="
                            mt-4
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-300
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-slate-700
                            hover:bg-slate-50
                        "
                    >
                        <Plus size={16} />

                        {
                            ar.purchases
                                .addItem
                        }
                    </button>


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
                                    {
                                        ar.purchases
                                            .total
                                    }
                                </span>


                                <strong
                                    className="
                                        text-xl
                                        text-slate-900
                                    "
                                >
                                    {
                                        formatCurrency(
                                            subtotal
                                        )
                                    }
                                </strong>

                            </div>

                        </div>

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
                                hover:bg-slate-800
                                disabled:opacity-60
                            "
                        >

                            {
                                saving
                                    ? ar.common
                                        .saving
                                    : ar.common.save
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
    outline-none
    focus:border-slate-500
`;


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


function Head({
    children,
}) {

    return (
        <th
            className="
                px-3
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
                px-3
                py-3
            "
        >
            {children}
        </td>
    );

}