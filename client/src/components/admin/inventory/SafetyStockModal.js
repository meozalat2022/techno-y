"use client";


import {
    useEffect,
    useState,
} from "react";

import {
    ShieldCheck,
    X,
} from "lucide-react";


export default function SafetyStockModal({
    open,
    product,
    saving,
    onClose,
    onSubmit,
}) {

    const [
        value,
        setValue,
    ] =
        useState("0");


    const [
        error,
        setError,
    ] =
        useState("");


    useEffect(
        () => {

            if (
                open &&
                product
            ) {

                setValue(
                    String(
                        product
                            .onlineSafetyStock ??
                        0
                    )
                );

                setError("");

            }

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


    const physicalStock =
        Number(
            product.stockQuantity
        ) || 0;


    const parsed =
        Number(value);


    const previewSafety =
        Number.isInteger(
            parsed
        ) &&
        parsed >=
            0
            ? parsed
            : 0;


    const onlineAvailable =
        Math.max(
            physicalStock -
                previewSafety,
            0
        );


    const handleSubmit =
        event => {

            event.preventDefault();

            setError("");


            if (
                !Number.isInteger(
                    parsed
                ) ||
                parsed <
                    0
            ) {

                setError(
                    "مخزون الأمان يجب أن يكون رقمًا صحيحًا صفر أو أكبر."
                );

                return;

            }


            onSubmit({
                productId:
                    product._id,

                onlineSafetyStock:
                    parsed,
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
                dir="rtl"
                className="
                    w-full
                    max-w-lg
                    rounded-2xl
                    bg-white
                    shadow-2xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-5
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-700
                            "
                        >
                            <ShieldCheck
                                size={19}
                            />
                        </div>

                        <div>
                            <h2
                                className="
                                    font-bold
                                    text-slate-900
                                "
                            >
                                مخزون الأمان للأونلاين
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                يحجز كمية من المخزون الفعلي من البيع عبر الموقع.
                            </p>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            hover:bg-slate-100
                        "
                        aria-label="إغلاق"
                    >
                        <X size={20} />
                    </button>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-5
                        p-5
                    "
                >

                    <div
                        className="
                            rounded-xl
                            bg-slate-50
                            p-4
                        "
                    >
                        <div
                            className="
                                font-semibold
                                text-slate-900
                            "
                        >
                            {product.title}
                        </div>

                        <div
                            dir="ltr"
                            className="
                                mt-1
                                w-fit
                                font-mono
                                text-xs
                                text-slate-500
                            "
                        >
                            {product.sku}
                        </div>
                    </div>


                    <label
                        className="
                            block
                        "
                    >
                        <span
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            الكمية المحجوزة من البيع أونلاين
                        </span>

                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                                value
                            }
                            onChange={
                                event =>
                                    setValue(
                                        event.target
                                            .value
                                    )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-slate-500
                            "
                        />

                        <p
                            className="
                                mt-2
                                text-xs
                                leading-5
                                text-slate-500
                            "
                        >
                            هذه الكمية تظل جزءًا من المخزون الفعلي، لكنها لن تكون متاحة للطلبات الأونلاين.
                        </p>
                    </label>


                    <div
                        className="
                            grid
                            grid-cols-3
                            gap-3
                        "
                    >
                        <Stat
                            label="المخزون الفعلي"
                            value={
                                physicalStock
                            }
                        />

                        <Stat
                            label="مخزون الأمان"
                            value={
                                previewSafety
                            }
                        />

                        <Stat
                            label="المتاح أونلاين"
                            value={
                                onlineAvailable
                            }
                        />
                    </div>


                    {error && (
                        <div
                            className="
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >
                            {error}
                        </div>
                    )}


                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                saving
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-300
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving
                            }
                            className="
                                rounded-xl
                                bg-slate-900
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                disabled:opacity-50
                            "
                        >
                            {
                                saving
                                    ? "جاري الحفظ..."
                                    : "حفظ"
                            }
                        </button>
                    </div>

                </form>

            </div>

        </div>

    );

}


function Stat({
    label,
    value,
}) {

    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                p-3
                text-center
            "
        >
            <div
                className="
                    text-[11px]
                    text-slate-500
                "
            >
                {label}
            </div>

            <div
                className="
                    mt-1
                    text-lg
                    font-black
                    text-slate-900
                "
            >
                {value}
            </div>
        </div>
    );

}
