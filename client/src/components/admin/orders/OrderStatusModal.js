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


const allowedTransitions = {

    pending: [
        "confirmed",
        "cancelled",
    ],

    confirmed: [
        "packed",
        "cancelled",
    ],

    processing: [
        "packed",
        "cancelled",
    ],

    packed: [
        "shipped",
        "cancelled",
    ],

    shipped: [
        "delivered",
    ],

    delivered: [],

    cancelled: [],

};


export default function OrderStatusModal({
    open,
    order,
    saving,
    onClose,
    onSubmit,
}) {

    const [
        status,
        setStatus,
    ] =
        useState("");


    useEffect(
        () => {

            if (
                !open ||
                !order
            ) {
                return;
            }


            const options =
                allowedTransitions[
                    order.status
                ] || [];


            setStatus(
                options[0] || ""
            );

        },
        [
            open,
            order,
        ]
    );


    if (
        !open ||
        !order
    ) {

        return null;

    }


    const options =
        allowedTransitions[
            order.status
        ] || [];


    const cancelling =
        status ===
        "cancelled";


    const handleSubmit =
        event => {

            event.preventDefault();


            if (!status) {
                return;
            }


            onSubmit(status);

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
                                ar.orders
                                    .updateStatus
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
                            الحالة الحالية
                        </div>


                        <div
                            className="
                                mt-2
                            "
                        >

                            <OrderStatusBadge
                                status={
                                    order.status
                                }
                            />

                        </div>

                    </div>


                    {
                        options.length >
                        0
                            ? (

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
                                            ar.orders
                                                .nextStatus
                                        }
                                    </span>


                                    <select
                                        value={status}
                                        onChange={
                                            event =>
                                                setStatus(
                                                    event
                                                        .target
                                                        .value
                                                )
                                        }
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-slate-300
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                        "
                                    >

                                        {
                                            options.map(
                                                option => (

                                                    <option
                                                        key={
                                                            option
                                                        }
                                                        value={
                                                            option
                                                        }
                                                    >
                                                        {
                                                            ar.orders[
                                                                option
                                                            ] ||
                                                            option
                                                        }
                                                    </option>

                                                )
                                            )
                                        }

                                    </select>

                                </label>

                            )
                            : (

                                <div
                                    className="
                                        mt-5
                                        rounded-xl
                                        bg-slate-50
                                        p-4
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    {
                                        ar.orders
                                            .noFurtherActions
                                    }
                                </div>

                            )
                    }


                    {
                        cancelling &&
                        (

                            <div
                                className="
                                    mt-5
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
                                            ar.orders
                                                .cancelWarning
                                        }
                                    </p>

                                </div>

                            </div>

                        )
                    }


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
                                text-slate-700
                            "
                        >
                            {ar.common.cancel}
                        </button>


                        {
                            options.length >
                            0 &&
                            (

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        !status
                                    }
                                    className={`
                                        rounded-lg
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        disabled:opacity-60
                                        ${
                                            cancelling
                                                ? "bg-red-700 hover:bg-red-800"
                                                : "bg-slate-900 hover:bg-slate-800"
                                        }
                                    `}
                                >

                                    {
                                        saving
                                            ? ar.common
                                                .saving
                                            : "تأكيد"
                                    }

                                </button>

                            )
                        }

                    </div>

                </form>

            </div>

        </div>

    );

}


function OrderStatusBadge({
    status,
}) {

    const styles = {

        pending:
            "bg-amber-50 text-amber-700",

        confirmed:
            "bg-blue-50 text-blue-700",

        processing:
            "bg-violet-50 text-violet-700",

        packed:
            "bg-indigo-50 text-indigo-700",

        shipped:
            "bg-cyan-50 text-cyan-700",

        delivered:
            "bg-emerald-50 text-emerald-700",

        cancelled:
            "bg-red-50 text-red-700",

    };


    return (

        <span
            className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${
                    styles[status] ||
                    "bg-slate-100 text-slate-700"
                }
            `}
        >
            {
                ar.orders[
                    status
                ] ||
                status
            }
        </span>

    );

}