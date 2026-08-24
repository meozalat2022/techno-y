"use client";


import {
    AlertTriangle,
    PackageCheck,
    X,
    XCircle,
} from "lucide-react";

import ar from
    "@/locales/ar";


export default function CustomerReturnActionModal({
    open,
    customerReturn,
    action,
    saving,
    onClose,
    onConfirm,
}) {

    if (
        !open ||
        !customerReturn ||
        !action
    ) {

        return null;

    }


    const receiving =
        action === "receive";


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
                                receiving
                                    ? ar.customerReturns
                                        .receive
                                    : ar.customerReturns
                                        .reject
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


                <div className="p-6">

                    <div
                        className={`
                            rounded-xl
                            border
                            p-4
                            ${
                                receiving
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-red-200 bg-red-50"
                            }
                        `}
                    >

                        <div
                            className="
                                flex
                                gap-3
                            "
                        >

                            {
                                receiving
                                    ? (

                                        <PackageCheck
                                            size={22}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-emerald-700
                                            "
                                        />

                                    )
                                    : (

                                        <AlertTriangle
                                            size={22}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-red-700
                                            "
                                        />

                                    )
                            }


                            <p
                                className={`
                                    text-sm
                                    leading-6
                                    ${
                                        receiving
                                            ? "text-emerald-800"
                                            : "text-red-800"
                                    }
                                `}
                            >
                                {
                                    receiving
                                        ? ar.customerReturns
                                            .confirmReceive
                                        : ar.customerReturns
                                            .confirmReject
                                }
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            mt-5
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
                            سبب المرتجع
                        </div>


                        <div
                            className="
                                mt-2
                                text-sm
                                text-slate-800
                            "
                        >
                            {
                                customerReturn.reason
                            }
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
                                text-slate-700
                            "
                        >
                            {ar.common.cancel}
                        </button>


                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={saving}
                            className={`
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                disabled:opacity-60
                                ${
                                    receiving
                                        ? "bg-emerald-700 hover:bg-emerald-800"
                                        : "bg-red-700 hover:bg-red-800"
                                }
                            `}
                        >

                            {
                                receiving
                                    ? (
                                        <PackageCheck
                                            size={16}
                                        />
                                    )
                                    : (
                                        <XCircle
                                            size={16}
                                        />
                                    )
                            }


                            {
                                saving
                                    ? ar.common.saving
                                    : receiving
                                        ? ar.customerReturns
                                            .receive
                                        : ar.customerReturns
                                            .reject
                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}