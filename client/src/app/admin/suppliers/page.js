"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Edit3,
    Eye,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";

import supplierService from
    "@/services/supplierService";

import SupplierFormModal from
    "@/components/admin/suppliers/SupplierFormModal";

import SupplierDetailsModal from
    "@/components/admin/suppliers/SupplierDetailsModal";

import ar from
    "@/locales/ar";


export default function SuppliersPage() {

    const [
        suppliers,
        setSuppliers,
    ] =
        useState([]);


    const [
        pagination,
        setPagination,
    ] =
        useState({
            page: 1,
            limit: 20,
            total: 0,
            pages: 1,
        });


    const [
        page,
        setPage,
    ] =
        useState(1);


    const [
        searchInput,
        setSearchInput,
    ] =
        useState("");


    const [
        search,
        setSearch,
    ] =
        useState("");


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        error,
        setError,
    ] =
        useState("");


    const [
        message,
        setMessage,
    ] =
        useState("");


    const [
        saving,
        setSaving,
    ] =
        useState(false);


    const [
        formOpen,
        setFormOpen,
    ] =
        useState(false);


    const [
        selectedSupplier,
        setSelectedSupplier,
    ] =
        useState(null);


    const [
        detailsSupplier,
        setDetailsSupplier,
    ] =
        useState(null);


    const loadSuppliers =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await supplierService
                            .getSuppliers({

                                page,

                                limit: 20,

                                search,

                            });


                    setSuppliers(
                        response.data ||
                        []
                    );


                    setPagination(
                        response.pagination ||
                        {
                            page: 1,
                            limit: 20,
                            total: 0,
                            pages: 1,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        ar.suppliers
                            .loadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                page,
                search,
            ]
        );


    useEffect(
        () => {

            loadSuppliers();

        },
        [
            loadSuppliers,
        ]
    );


    const handleSearch =
        event => {

            event.preventDefault();

            setPage(1);

            setSearch(
                searchInput.trim()
            );

        };


    const openCreate =
        () => {

            setSelectedSupplier(
                null
            );

            setFormOpen(
                true
            );

        };


    const openEdit =
        supplier => {

            setSelectedSupplier(
                supplier
            );

            setFormOpen(
                true
            );

        };


    const handleSave =
        async supplierData => {

            setSaving(true);

            setMessage("");

            setError("");


            try {

                if (
                    selectedSupplier
                ) {

                    await supplierService
                        .updateSupplier(

                            selectedSupplier
                                ._id,

                            supplierData

                        );


                    setMessage(
                        ar.suppliers
                            .updateSuccess
                    );

                } else {

                    await supplierService
                        .createSupplier(
                            supplierData
                        );


                    setMessage(
                        ar.suppliers
                            .createSuccess
                    );

                }


                setFormOpen(
                    false
                );

                setSelectedSupplier(
                    null
                );


                await loadSuppliers();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.suppliers
                        .saveError

                );

            } finally {

                setSaving(false);

            }

        };


    const handleDelete =
        async supplier => {

            const confirmed =
                window.confirm(
                    `${ar.suppliers.deleteConfirm}\n${supplier.name}`
                );


            if (!confirmed) {
                return;
            }


            setMessage("");

            setError("");


            try {

                await supplierService
                    .deleteSupplier(
                        supplier._id
                    );


                setMessage(
                    ar.suppliers
                        .deleteSuccess
                );


                await loadSuppliers();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.suppliers
                        .deleteError

                );

            }

        };


    return (

        <div>

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {ar.suppliers.title}
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        {
                            ar.suppliers
                                .description
                        }
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        openCreate
                    }
                    className="
                        flex
                        w-fit
                        items-center
                        gap-2
                        rounded-lg
                        bg-slate-900
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        hover:bg-slate-800
                    "
                >

                    <Plus size={18} />

                    {
                        ar.suppliers
                            .addSupplier
                    }

                </button>

            </div>


            <div
                className="
                    mt-6
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                "
            >

                <form
                    onSubmit={
                        handleSearch
                    }
                    className="
                        flex
                        max-w-3xl
                        gap-2
                    "
                >

                    <div
                        className="
                            flex
                            flex-1
                            items-center
                            rounded-lg
                            border
                            border-slate-300
                            px-3
                        "
                    >

                        <Search
                            size={17}
                            className="
                                text-slate-400
                            "
                        />

                        <input
                            value={
                                searchInput
                            }
                            onChange={
                                event =>
                                    setSearchInput(
                                        event
                                            .target
                                            .value
                                    )
                            }
                            placeholder={
                                ar.suppliers
                                    .searchPlaceholder
                            }
                            className="
                                w-full
                                bg-transparent
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                            "
                        />

                    </div>


                    <button
                        type="submit"
                        className="
                            rounded-lg
                            bg-slate-900
                            px-5
                            text-sm
                            font-medium
                            text-white
                        "
                    >
                        {ar.common.search}
                    </button>

                </form>

            </div>


            {message && (

                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-4
                        py-3
                        text-sm
                        text-emerald-700
                    "
                >
                    {message}
                </div>

            )}


            {error && (

                <div
                    className="
                        mt-4
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
                    mt-5
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >

                {
                    loading
                        ? (

                            <LoadingState />

                        )
                        : suppliers.length ===
                            0
                            ? (

                                <EmptyState />

                            )
                            : (

                                <SuppliersTable
                                    suppliers={
                                        suppliers
                                    }
                                    onView={
                                        setDetailsSupplier
                                    }
                                    onEdit={
                                        openEdit
                                    }
                                    onDelete={
                                        handleDelete
                                    }
                                />

                            )
                }

            </div>


            {
                pagination.pages >
                1 &&
                (

                    <div
                        className="
                            mt-5
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
                            صفحة{" "}
                            {pagination.page}{" "}
                            من{" "}
                            {pagination.pages}
                        </span>


                        <div
                            className="
                                flex
                                gap-2
                            "
                        >

                            <button
                                type="button"
                                disabled={
                                    page <= 1
                                }
                                onClick={
                                    () =>
                                        setPage(
                                            previous =>
                                                previous -
                                                1
                                        )
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    disabled:opacity-40
                                "
                            >
                                السابق
                            </button>


                            <button
                                type="button"
                                disabled={
                                    page >=
                                    pagination.pages
                                }
                                onClick={
                                    () =>
                                        setPage(
                                            previous =>
                                                previous +
                                                1
                                        )
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    disabled:opacity-40
                                "
                            >
                                التالي
                            </button>

                        </div>

                    </div>

                )
            }


            <SupplierFormModal
                open={
                    formOpen
                }
                supplier={
                    selectedSupplier
                }
                saving={
                    saving
                }
                onClose={
                    () =>
                        setFormOpen(
                            false
                        )
                }
                onSubmit={
                    handleSave
                }
            />


            <SupplierDetailsModal
                open={
                    Boolean(
                        detailsSupplier
                    )
                }
                supplier={
                    detailsSupplier
                }
                onClose={
                    () =>
                        setDetailsSupplier(
                            null
                        )
                }
            />

        </div>

    );

}


function SuppliersTable({
    suppliers,
    onView,
    onEdit,
    onDelete,
}) {

    return (

        <div className="overflow-x-auto">

            <table
                className="
                    w-full
                    min-w-[900px]
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
                                ar.suppliers.name
                            }
                        </Head>

                        <Head>
                            {
                                ar.suppliers
                                    .contactPerson
                            }
                        </Head>

                        <Head>
                            {
                                ar.suppliers.phone
                            }
                        </Head>

                        <Head>
                            {
                                ar.suppliers.email
                            }
                        </Head>

                        <Head>
                            {
                                ar.suppliers.address
                            }
                        </Head>

                        <Head>
                            {
                                ar.suppliers.actions
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
                        suppliers.map(
                            supplier => (

                                <tr
                                    key={
                                        supplier._id
                                    }
                                    className="
                                        hover:bg-slate-50/70
                                    "
                                >

                                    <Cell>

                                        <strong
                                            className="
                                                text-slate-900
                                            "
                                        >
                                            {
                                                supplier.name
                                            }
                                        </strong>

                                    </Cell>


                                    <Cell>
                                        {
                                            supplier
                                                .contactPerson ||
                                            "—"
                                        }
                                    </Cell>


                                    <Cell>

                                        <span dir="ltr">
                                            {
                                                supplier.phone
                                            }
                                        </span>

                                    </Cell>


                                    <Cell>

                                        <span dir="ltr">
                                            {
                                                supplier.email ||
                                                "—"
                                            }
                                        </span>

                                    </Cell>


                                    <Cell>

                                        <div
                                            className="
                                                max-w-[260px]
                                                truncate
                                            "
                                        >
                                            {
                                                supplier.address ||
                                                "—"
                                            }
                                        </div>

                                    </Cell>


                                    <Cell>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <ActionButton
                                                title={
                                                    ar.common.view
                                                }
                                                onClick={
                                                    () =>
                                                        onView(
                                                            supplier
                                                        )
                                                }
                                            >
                                                <Eye size={16} />
                                            </ActionButton>


                                            <ActionButton
                                                title={
                                                    ar.common.edit
                                                }
                                                onClick={
                                                    () =>
                                                        onEdit(
                                                            supplier
                                                        )
                                                }
                                            >
                                                <Edit3 size={16} />
                                            </ActionButton>


                                            <button
                                                type="button"
                                                title={
                                                    ar.common.delete
                                                }
                                                onClick={
                                                    () =>
                                                        onDelete(
                                                            supplier
                                                        )
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-red-200
                                                    p-2
                                                    text-red-600
                                                    hover:bg-red-50
                                                "
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </Cell>

                                </tr>

                            )
                        )
                    }

                </tbody>

            </table>

        </div>

    );

}


function ActionButton({
    children,
    title,
    onClick,
}) {

    return (

        <button
            type="button"
            title={title}
            onClick={onClick}
            className="
                rounded-lg
                border
                border-slate-300
                p-2
                text-slate-600
                hover:bg-slate-100
            "
        >
            {children}
        </button>

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
                whitespace-nowrap
                px-4
                py-4
                text-slate-600
            "
        >
            {children}
        </td>

    );

}


function LoadingState() {

    return (

        <div
            className="
                flex
                min-h-[320px]
                items-center
                justify-center
            "
        >

            <RefreshCw
                size={26}
                className="
                    animate-spin
                    text-slate-400
                "
            />

        </div>

    );

}


function EmptyState() {

    return (

        <div
            className="
                flex
                min-h-[300px]
                items-center
                justify-center
                p-6
                text-center
                text-sm
                text-slate-500
            "
        >
            {
                ar.suppliers
                    .noSuppliers
            }
        </div>

    );

}