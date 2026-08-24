"use client";


import {
    Mail,
    MapPin,
    Phone,
    UserRound,
    X,
} from "lucide-react";

import ar from
    "@/locales/ar";


export default function SupplierDetailsModal({
    open,
    supplier,
    onClose,
}) {

    if (
        !open ||
        !supplier
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
                    w-full
                    max-w-xl
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
                                ar.suppliers
                                    .supplierDetails
                            }
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            {supplier.name}
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


                <div
                    className="
                        space-y-4
                        p-6
                    "
                >

                    <DetailRow
                        icon={
                            UserRound
                        }
                        label={
                            ar.suppliers
                                .contactPerson
                        }
                        value={
                            supplier.contactPerson ||
                            "—"
                        }
                    />


                    <DetailRow
                        icon={Phone}
                        label={
                            ar.suppliers.phone
                        }
                        value={
                            supplier.phone ||
                            "—"
                        }
                        ltr
                    />


                    <DetailRow
                        icon={Mail}
                        label={
                            ar.suppliers.email
                        }
                        value={
                            supplier.email ||
                            "—"
                        }
                        ltr
                    />


                    <DetailRow
                        icon={MapPin}
                        label={
                            ar.suppliers.address
                        }
                        value={
                            supplier.address ||
                            "—"
                        }
                    />


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
                                font-medium
                                text-slate-500
                            "
                        >
                            {
                                ar.suppliers.notes
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
                                supplier.notes ||
                                "—"
                            }
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


function DetailRow({
    icon: Icon,
    label,
    value,
    ltr = false,
}) {

    return (

        <div
            className="
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-slate-200
                p-4
            "
        >

            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-600
                "
            >
                <Icon size={17} />
            </div>


            <div>

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
                        mt-1
                        text-sm
                        font-medium
                        text-slate-800
                    "
                >
                    {value}
                </div>

            </div>

        </div>

    );

}