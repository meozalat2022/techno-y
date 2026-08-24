"use client";


import {
    useEffect,
    useState,
} from "react";

import {
    AlertTriangle,
    X,
} from "lucide-react";

import ar from
    "@/locales/ar";


export default function StockAdjustmentModal({
    open,
    product,
    saving,
    onClose,
    onSubmit,
}) {

    const [
        operation,
        setOperation,
    ] =
        useState("increase");


    const [
        quantity,
        setQuantity,
    ] =
        useState("");


    const [
        reason,
        setReason,
    ] =
        useState("");


    useEffect(
        () => {

            if (!open) {
                return;
            }


            setOperation(
                "increase"
            );

            setQuantity("");

            setReason("");

        },
        [
            open,
            product,
        ]
    );


    if (
        !open ||
        !product
    ) {

        return null;

    }


    const handleSubmit =
        event => {

            event.preventDefault();


            onSubmit({

                productId:
                    product._id,

                quantity:
                    Number(
                        quantity
                    ),

                operation,

                reason:
                    reason.trim(),

            });

        };


    const calculatedStock =
        operation === "increase"

            ? product.stockQuantity +
                (
                    Number(
                        quantity
                    ) || 0
                )

            : product.stockQuantity -
                (
                    Number(
                        quantity
                    ) || 0
                );


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
                    w-full
                    max-w-lg
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
                                ar.inventory
                                    .adjustStock
                            }
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            {product.title}
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
                                    ar.inventory
                                        .currentStock
                                }
                            </span>

                            <strong
                                className="
                                    text-lg
                                    text-slate-900
                                "
                            >
                                {
                                    product
                                        .stockQuantity
                                }
                            </strong>

                        </div>


                        {
                            quantity &&
                            Number(
                                quantity
                            ) > 0 &&
                            calculatedStock >= 0 &&
                            (

                                <div
                                    className="
                                        mt-3
                                        flex
                                        justify-between
                                        border-t
                                        border-slate-200
                                        pt-3
                                    "
                                >

                                    <span
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        {
                                            ar.inventory
                                                .newStock
                                        }
                                    </span>


                                    <strong
                                        className="
                                            text-lg
                                            text-slate-900
                                        "
                                    >
                                        {
                                            calculatedStock
                                        }
                                    </strong>

                                </div>

                            )
                        }

                    </div>


                    <div
                        className="
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                gap-3
                            "
                        >

                            <AlertTriangle
                                size={20}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-amber-600
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    leading-6
                                    text-amber-800
                                "
                            >
                                {
                                    ar.inventory
                                        .adjustmentWarning
                                }
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            mt-5
                            grid
                            gap-5
                            sm:grid-cols-2
                        "
                    >

                        <label>

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
                                    ar.inventory
                                        .operation
                                }
                            </span>


                            <select
                                value={
                                    operation
                                }
                                onChange={
                                    event =>
                                        setOperation(
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            >

                                <option
                                    value="increase"
                                >
                                    {
                                        ar.inventory
                                            .increase
                                    }
                                </option>

                                <option
                                    value="decrease"
                                >
                                    {
                                        ar.inventory
                                            .decrease
                                    }
                                </option>

                            </select>

                        </label>


                        <label>

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
                                    ar.inventory
                                        .quantity
                                }
                            </span>


                            <input
                                required
                                type="number"
                                min="1"
                                step="1"
                                value={
                                    quantity
                                }
                                onChange={
                                    event =>
                                        setQuantity(
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </label>

                    </div>


                    <label
                        className="
                            mt-5
                            block
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
                                ar.inventory
                                    .reason
                            }
                        </span>


                        <textarea
                            required
                            rows="3"
                            value={
                                reason
                            }
                            onChange={
                                event =>
                                    setReason(
                                        event
                                            .target
                                            .value
                                    )
                            }
                            placeholder={
                                ar.inventory
                                    .reasonPlaceholder
                            }
                            className={
                                inputClass
                            }
                        />

                    </label>


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
                                font-medium
                                text-slate-700
                                hover:bg-slate-50
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
    text-slate-900
    outline-none
    transition
    focus:border-slate-500
`;