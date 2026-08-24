"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    CheckCircle2,
    Eye,
    PackageCheck,
    Plus,
    RefreshCw,
    Search,
} from "lucide-react";

import purchaseService from
    "@/services/purchaseService";

import supplierService from
    "@/services/supplierService";

import productService from
    "@/services/productService";

import PurchaseFormModal from
    "@/components/admin/purchases/PurchaseFormModal";

import PurchaseDetailsModal from
    "@/components/admin/purchases/PurchaseDetailsModal";

import ReceivePurchaseModal from
    "@/components/admin/purchases/ReceivePurchaseModal";

import ar from
    "@/locales/ar";


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


const formatDate =
    value =>
        new Intl.DateTimeFormat(
            "ar-EG",
            {
                dateStyle:
                    "medium",
            }
        ).format(
            new Date(value)
        );


export default function PurchasesPage() {

    const [
        purchases,
        setPurchases,
    ] =
        useState([]);


    const [
        suppliers,
        setSuppliers,
    ] =
        useState([]);


    const [
        products,
        setProducts,
    ] =
        useState([]);


    const [
        pagination,
        setPagination,
    ] =
        useState({
            page: 1,
            pages: 1,
            total: 0,
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
        status,
        setStatus,
    ] =
        useState("");


    const [
        supplier,
        setSupplier,
    ] =
        useState("");


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        saving,
        setSaving,
    ] =
        useState(false);


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
        createOpen,
        setCreateOpen,
    ] =
        useState(false);


    const [
        detailsPurchase,
        setDetailsPurchase,
    ] =
        useState(null);


    const [
        receivePurchase,
        setReceivePurchase,
    ] =
        useState(null);


    const loadPurchases =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await purchaseService
                            .getPurchases({

                                page,

                                limit: 20,

                                search,

                                status,

                                supplier,

                            });


                    setPurchases(
                        response.data ||
                        []
                    );


                    setPagination(
                        response.pagination ||
                        {
                            page: 1,
                            pages: 1,
                            total: 0,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        ar.purchases
                            .loadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                page,
                search,
                status,
                supplier,
            ]
        );


    const loadOptions =
        useCallback(
            async () => {

                try {

                    const [
                        supplierResponse,
                        productResponse,
                    ] =
                        await Promise.all([

                            supplierService
                                .getSuppliers({
                                    page: 1,
                                    limit: 100,
                                }),

                            productService
                                .getProducts({
                                    page: 1,
                                    limit: 100,
                                    sort: "newest",
                                }),

                        ]);


                    setSuppliers(
                        supplierResponse
                            .data ||
                        []
                    );


                    setProducts(
                        productResponse
                            .data ||
                        []
                    );


                } catch {
                    // Main list can still load.
                }

            },
            []
        );


    useEffect(
        () => {

            loadOptions();

        },
        [loadOptions]
    );


    useEffect(
        () => {

            loadPurchases();

        },
        [loadPurchases]
    );


    const handleSearch =
        event => {

            event.preventDefault();

            setPage(1);

            setSearch(
                searchInput.trim()
            );

        };


    const handleCreate =
        async purchaseData => {

            setSaving(true);

            setError("");

            setMessage("");


            try {

                await purchaseService
                    .createPurchase(
                        purchaseData
                    );


                setCreateOpen(
                    false
                );


                setMessage(
                    ar.purchases
                        .createSuccess
                );


                await loadPurchases();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.purchases
                        .createError

                );

            } finally {

                setSaving(false);

            }

        };


    const handleView =
        async purchase => {

            setError("");


            try {

                const response =
                    await purchaseService
                        .getPurchaseByNumber(
                            purchase
                                .purchaseNumber
                        );


                setDetailsPurchase(
                    response.data
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.purchases
                        .detailsError

                );

            }

        };


    const handleSubmitPurchase =
        async purchase => {

            const confirmed =
                window.confirm(
                    ar.purchases
                        .confirmSubmit
                );


            if (!confirmed) {
                return;
            }


            setError("");

            setMessage("");


            try {

                await purchaseService
                    .submitPurchase(
                        purchase._id
                    );


                setMessage(
                    ar.purchases
                        .submitSuccess
                );


                await loadPurchases();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.purchases
                        .submitError

                );

            }

        };


    const openReceive =
        async purchase => {

            setError("");


            try {

                const response =
                    await purchaseService
                        .getPurchaseByNumber(
                            purchase
                                .purchaseNumber
                        );


                setReceivePurchase(
                    response.data
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.purchases
                        .detailsError

                );

            }

        };


    const handleReceive =
        async items => {

            if (!receivePurchase) {
                return;
            }


            setSaving(true);

            setError("");

            setMessage("");


            try {

                await purchaseService
                    .receivePurchase(

                        receivePurchase._id,

                        items

                    );


                setReceivePurchase(
                    null
                );


                setMessage(
                    ar.purchases
                        .receiveSuccess
                );


                await loadPurchases();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.purchases
                        .receiveError

                );

            } finally {

                setSaving(false);

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
                        {ar.purchases.title}
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        {
                            ar.purchases
                                .description
                        }
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        () =>
                            setCreateOpen(
                                true
                            )
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
                    "
                >
                    <Plus size={18} />

                    {
                        ar.purchases
                            .addPurchase
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

                <div
                    className="
                        grid
                        gap-3
                        lg:grid-cols-[2fr_1fr_1fr]
                    "
                >

                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="
                            flex
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
                                    ar.purchases
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
                            className="
                                rounded-lg
                                bg-slate-900
                                px-4
                                text-sm
                                text-white
                            "
                        >
                            {ar.common.search}
                        </button>

                    </form>


                    <select
                        value={status}
                        onChange={
                            event => {

                                setPage(1);

                                setStatus(
                                    event.target
                                        .value
                                );

                            }
                        }
                        className={
                            selectClass
                        }
                    >

                        <option value="">
                            {
                                ar.purchases
                                    .allStatuses
                            }
                        </option>

                        <option value="draft">
                            مسودة
                        </option>

                        <option value="ordered">
                            تم الاعتماد
                        </option>

                        <option value="partially_received">
                            استلام جزئي
                        </option>

                        <option value="received">
                            تم الاستلام
                        </option>

                    </select>


                    <select
                        value={supplier}
                        onChange={
                            event => {

                                setPage(1);

                                setSupplier(
                                    event.target
                                        .value
                                );

                            }
                        }
                        className={
                            selectClass
                        }
                    >

                        <option value="">
                            {
                                ar.purchases
                                    .allSuppliers
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

                </div>

            </div>


            {message && (
                <SuccessMessage>
                    {message}
                </SuccessMessage>
            )}


            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
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
                        : purchases.length ===
                            0
                            ? (
                                <EmptyState />
                            )
                            : (
                                <PurchasesTable
                                    purchases={
                                        purchases
                                    }
                                    onView={
                                        handleView
                                    }
                                    onSubmit={
                                        handleSubmitPurchase
                                    }
                                    onReceive={
                                        openReceive
                                    }
                                />
                            )
                }

            </div>


            {
                pagination.pages >
                1 &&
                (

                    <Pagination
                        page={page}
                        pages={
                            pagination.pages
                        }
                        onChange={
                            setPage
                        }
                    />

                )
            }


            <PurchaseFormModal
                open={createOpen}
                suppliers={suppliers}
                products={products}
                saving={saving}
                onClose={
                    () =>
                        setCreateOpen(
                            false
                        )
                }
                onSubmit={
                    handleCreate
                }
            />


            <PurchaseDetailsModal
                open={
                    Boolean(
                        detailsPurchase
                    )
                }
                purchase={
                    detailsPurchase
                }
                onClose={
                    () =>
                        setDetailsPurchase(
                            null
                        )
                }
            />


            <ReceivePurchaseModal
                open={
                    Boolean(
                        receivePurchase
                    )
                }
                purchase={
                    receivePurchase
                }
                saving={saving}
                onClose={
                    () =>
                        setReceivePurchase(
                            null
                        )
                }
                onSubmit={
                    handleReceive
                }
            />

        </div>

    );

}


function PurchasesTable({
    purchases,
    onView,
    onSubmit,
    onReceive,
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
                            رقم أمر الشراء
                        </Head>

                        <Head>
                            المورد
                        </Head>

                        <Head>
                            الحالة
                        </Head>

                        <Head>
                            الإجمالي
                        </Head>

                        <Head>
                            التاريخ
                        </Head>

                        <Head>
                            الإجراءات
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
                        purchases.map(
                            purchase => (

                                <tr
                                    key={
                                        purchase._id
                                    }
                                    className="
                                        hover:bg-slate-50
                                    "
                                >

                                    <Cell>

                                        <span
                                            dir="ltr"
                                            className="
                                                font-mono
                                                font-semibold
                                                text-slate-900
                                            "
                                        >
                                            {
                                                purchase
                                                    .purchaseNumber
                                            }
                                        </span>

                                    </Cell>


                                    <Cell>
                                        {
                                            purchase.supplier
                                                ?.name ||
                                            "—"
                                        }
                                    </Cell>


                                    <Cell>

                                        <PurchaseStatusBadge
                                            status={
                                                purchase.status
                                            }
                                        />

                                    </Cell>


                                    <Cell>

                                        <strong>
                                            {
                                                formatCurrency(
                                                    purchase
                                                        .totals
                                                        .total
                                                )
                                            }
                                        </strong>

                                    </Cell>


                                    <Cell>
                                        {
                                            formatDate(
                                                purchase
                                                    .createdAt
                                            )
                                        }
                                    </Cell>


                                    <Cell>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Action
                                                title="عرض"
                                                onClick={
                                                    () =>
                                                        onView(
                                                            purchase
                                                        )
                                                }
                                            >
                                                <Eye size={16} />
                                            </Action>


                                            {
                                                purchase.status ===
                                                "draft" &&
                                                (

                                                    <Action
                                                        title="اعتماد"
                                                        onClick={
                                                            () =>
                                                                onSubmit(
                                                                    purchase
                                                                )
                                                        }
                                                    >
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                    </Action>

                                                )
                                            }


                                            {
                                                [
                                                    "ordered",
                                                    "partially_received",
                                                ].includes(
                                                    purchase.status
                                                ) &&
                                                (

                                                    <Action
                                                        title="استلام"
                                                        onClick={
                                                            () =>
                                                                onReceive(
                                                                    purchase
                                                                )
                                                        }
                                                    >
                                                        <PackageCheck
                                                            size={16}
                                                        />
                                                    </Action>

                                                )
                                            }

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


function PurchaseStatusBadge({
    status,
}) {

    const styles = {

        draft:
            "bg-slate-100 text-slate-700",

        ordered:
            "bg-blue-50 text-blue-700",

        partially_received:
            "bg-amber-50 text-amber-700",

        received:
            "bg-emerald-50 text-emerald-700",

        cancelled:
            "bg-red-50 text-red-700",

    };


    return (

        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${
                    styles[status] ||
                    "bg-slate-100"
                }
            `}
        >
            {
                ar.purchases[
                    status
                ] ||
                status
            }
        </span>

    );

}


function Action({
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


function Pagination({
    page,
    pages,
    onChange,
}) {

    return (

        <div
            className="
                mt-5
                flex
                justify-between
            "
        >

            <span
                className="
                    text-sm
                    text-slate-500
                "
            >
                صفحة {page} من {pages}
            </span>


            <div className="flex gap-2">

                <button
                    disabled={
                        page <= 1
                    }
                    onClick={
                        () =>
                            onChange(
                                page - 1
                            )
                    }
                    className={pageButton}
                >
                    السابق
                </button>


                <button
                    disabled={
                        page >= pages
                    }
                    onClick={
                        () =>
                            onChange(
                                page + 1
                            )
                    }
                    className={pageButton}
                >
                    التالي
                </button>

            </div>

        </div>

    );

}


const selectClass = `
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
`;


const pageButton = `
    rounded-lg
    border
    border-slate-300
    bg-white
    px-4
    py-2
    text-sm
    disabled:opacity-40
`;


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
                text-sm
                text-slate-500
            "
        >
            {
                ar.purchases
                    .noPurchases
            }
        </div>

    );

}


function SuccessMessage({
    children,
}) {

    return (

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
            {children}
        </div>

    );

}


function ErrorMessage({
    children,
}) {

    return (

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
            {children}
        </div>

    );

}