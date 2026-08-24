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


const emptyForm = {

    name: "",

    contactPerson: "",

    email: "",

    phone: "",

    address: "",

    notes: "",

};


export default function SupplierFormModal({
    open,
    supplier,
    saving,
    onClose,
    onSubmit,
}) {

    const [
        form,
        setForm,
    ] =
        useState(
            emptyForm
        );


    useEffect(
        () => {

            if (!open) {
                return;
            }


            if (supplier) {

                setForm({

                    name:
                        supplier.name || "",

                    contactPerson:
                        supplier.contactPerson || "",

                    email:
                        supplier.email || "",

                    phone:
                        supplier.phone || "",

                    address:
                        supplier.address || "",

                    notes:
                        supplier.notes || "",

                });

            } else {

                setForm(
                    emptyForm
                );

            }

        },
        [
            open,
            supplier,
        ]
    );


    if (!open) {
        return null;
    }


    const updateField =
        (
            field,
            value
        ) => {

            setForm(
                previous => ({

                    ...previous,

                    [field]:
                        value,

                })
            );

        };


    const handleSubmit =
        event => {

            event.preventDefault();


            onSubmit({

                name:
                    form.name.trim(),

                contactPerson:
                    form.contactPerson
                        .trim(),

                email:
                    form.email.trim(),

                phone:
                    form.phone.trim(),

                address:
                    form.address.trim(),

                notes:
                    form.notes.trim(),

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
                    w-full
                    max-w-2xl
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

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        {
                            supplier
                                ? ar.suppliers
                                    .editSupplier
                                : ar.suppliers
                                    .addSupplier
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

                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        <FormField
                            label={
                                ar.suppliers.name
                            }
                        >

                            <input
                                required
                                value={
                                    form.name
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "name",
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField
                            label={
                                ar.suppliers
                                    .contactPerson
                            }
                        >

                            <input
                                value={
                                    form.contactPerson
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "contactPerson",
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField
                            label={
                                ar.suppliers.phone
                            }
                        >

                            <input
                                required
                                dir="ltr"
                                value={
                                    form.phone
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "phone",
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField
                            label={
                                ar.suppliers.email
                            }
                        >

                            <input
                                type="email"
                                dir="ltr"
                                value={
                                    form.email
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "email",
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>

                    </div>


                    <div
                        className="
                            mt-5
                        "
                    >

                        <FormField
                            label={
                                ar.suppliers.address
                            }
                        >

                            <textarea
                                rows="3"
                                value={
                                    form.address
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "address",
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>

                    </div>


                    <div
                        className="
                            mt-5
                        "
                    >

                        <FormField
                            label={
                                ar.suppliers.notes
                            }
                        >

                            <textarea
                                rows="3"
                                value={
                                    form.notes
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "notes",
                                            event
                                                .target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>

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


function FormField({
    label,
    children,
}) {

    return (

        <label className="block">

            <span
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                "
            >
                {label}
            </span>


            {children}

        </label>

    );

}