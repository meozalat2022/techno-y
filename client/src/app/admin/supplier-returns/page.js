"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Eye,
    RefreshCw,
    Search,
    Send,
    XCircle,
} from "lucide-react";

import supplierReturnService from
    "@/services/supplierReturnService";

import supplierService from
    "@/services/supplierService";

import SupplierReturnDetailsModal from
    "@/components/admin/supplierReturns/SupplierReturnDetailsModal";

import SupplierReturnActionModal from
    "@/components/admin/supplierReturns/SupplierReturnActionModal";

import ar from
    "@/locales/ar";


const formatDate =
    value => {

        if (!value) {
            return "—";
        }


        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                dateStyle: "medium",
            }
        ).format(
            new Date(value)
        );

    };


export default function SupplierReturnsPage() {

    const [
        returns,
        setReturns,
    ] =
        useState([]);


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
            pages: 1,
            total: 0,
            limit: 20,
        });


    const [
        page,
        setPage,
    ] =
        useState(1);


    const [
        purchaseNumberInput,
        setPurchaseNumberInput,
    ] =
        useState("");


    const [
        purchaseNumber,
        setPurchaseNumber,
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
        detailsReturn,
        setDetailsReturn,
    ] =
        useState(null);


    const [
        actionReturn,
        setActionReturn,
    ] =
        useState(null);


    const [
        actionType,
        setActionType,
    ] =
        useState("");


    const loadReturns =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await supplierReturnService
                            .getSupplierReturns({

                                page,

                                limit: 20,

                                status,

                                purchaseNumber,

                                supplier,

                            });


                    setReturns(
                        response.data ||
                        []
                    );


                    setPagination(
                        response.pagination ||
                        {
                            page: 1,
                            pages: 1,
                            total: 0,
                            limit: 20,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        ar.supplierReturns
                            .loadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                page,
                status,
                purchaseNumber,
                supplier,
            ]
        );


    const loadSuppliers =
        useCallback(
            async () => {

                try {

                    const response =
                        await supplierService
                            .getSuppliers({
                                page: 1,
                                limit: 100,
                            });


                    setSuppliers(
                        response.data ||
                        []
                    );

                } catch {
                    // Return list can still load.
                }

            },
            []
        );


    useEffect(
        () => {

            loadSuppliers();

        },
        [loadSuppliers]
    );


    useEffect(
        () => {

            loadReturns();

        },
        [loadReturns]
    );


    const handleSearch =
        event => {

            event.preventDefault();

            setPage(1);

            setPurchaseNumber(
                purchaseNumberInput.trim()
            );

        };


    const handleView =
        async supplierReturn => {

            setError("");


            try {

                const response =
                    await supplierReturnService
                        .getSupplierReturnByNumber(
                            supplierReturn
                                .returnNumber
                        );


                setDetailsReturn(
                    response.data
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.supplierReturns
                        .detailsError

                );

            }

        };


    const openAction = (
        supplierReturn,
        type
    ) => {

        setActionReturn(
            supplierReturn
        );

        setActionType(
            type
        );

    };


    const closeAction =
        () => {

            if (saving) {
                return;
            }


            setActionReturn(
                null
            );

            setActionType("");

        };


    const handleAction =
        async () => {

            if (
                !actionReturn ||
                !actionType
            ) {
                return;
            }


            setSaving(true);

            setError("");

            setMessage("");


            try {

                if (
                    actionType === "send"
                ) {

                    await supplierReturnService
                        .sendSupplierReturn(
                            actionReturn._id
                        );


                    setMessage(
                        ar.supplierReturns
                            .sendSuccess
                    );

                } else {

                    await supplierReturnService
                        .rejectSupplierReturn(
                            actionReturn._id
                        );


                    setMessage(
                        ar.supplierReturns
                            .rejectSuccess
                    );

                }


                setActionReturn(
                    null
                );

                setActionType("");


                await loadReturns();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    (
                        actionType ===
                        "send"
                            ? ar.supplierReturns
                                .sendError
                            : ar.supplierReturns
                                .rejectError
                    )

                );

            } finally {

                setSaving(false);

            }

        };


    return (

        <div>

            <div>

                <h1
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    {
                        ar.supplierReturns
                            .title
                    }
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    {
                        ar.supplierReturns
                            .description
                    }
                </p>

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
                                dir="ltr"
                                value={
                                    purchaseNumberInput
                                }
                                onChange={
                                    event =>
                                        setPurchaseNumberInput(
                                            event.target.value
                                        )
                                }
                                placeholder={
                                    ar.supplierReturns
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


                    <select
                        value={status}
                        onChange={
                            event => {

                                setPage(1);

                                setStatus(
                                    event.target.value
                                );

                            }
                        }
                        className={selectClass}
                    >

                        <option value="">
                            {
                                ar.supplierReturns
                                    .allStatuses
                            }
                        </option>

                        <option value="requested">
                            قيد الطلب
                        </option>

                        <option value="sent">
                            تم الإرسال
                        </option>

                        <option value="rejected">
                            مرفوض
                        </option>

                    </select>


                    <select
                        value={supplier}
                        onChange={
                            event => {

                                setPage(1);

                                setSupplier(
                                    event.target.value
                                );

                            }
                        }
                        className={selectClass}
                    >

                        <option value="">
                            {
                                ar.supplierReturns
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
                                        {supplier.name}
                                    </option>

                                )
                            )
                        }

                    </select>

                </div>

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
                        : returns.length ===
                            0
                            ? (
                                <EmptyState />
                            )
                            : (

                                <ReturnsTable
                                    returns={
                                        returns
                                    }
                                    onView={
                                        handleView
                                    }
                                    onSend={
                                        supplierReturn =>
                                            openAction(
                                                supplierReturn,
                                                "send"
                                            )
                                    }
                                    onReject={
                                        supplierReturn =>
                                            openAction(
                                                supplierReturn,
                                                "reject"
                                            )
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


                        <div className="flex gap-2">

                            <button
                                type="button"
                                disabled={
                                    page <= 1
                                }
                                onClick={
                                    () =>
                                        setPage(
                                            previous =>
                                                previous - 1
                                        )
                                }
                                className={pageButton}
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
                                                previous + 1
                                        )
                                }
                                className={pageButton}
                            >
                                التالي
                            </button>

                        </div>

                    </div>

                )
            }


            <SupplierReturnDetailsModal
                open={
                    Boolean(
                        detailsReturn
                    )
                }
                supplierReturn={
                    detailsReturn
                }
                onClose={
                    () =>
                        setDetailsReturn(
                            null
                        )
                }
            />


            <SupplierReturnActionModal
                open={
                    Boolean(
                        actionReturn
                    )
                }
                supplierReturn={
                    actionReturn
                }
                action={
                    actionType
                }
                saving={
                    saving
                }
                onClose={
                    closeAction
                }
                onConfirm={
                    handleAction
                }
            />

        </div>

    );

}


function ReturnsTable({
    returns,
    onView,
    onSend,
    onReject,
}) {

    return (

        <div className="overflow-x-auto">

            <table
                className="
                    w-full
                    min-w-[1050px]
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
                                ar.supplierReturns
                                    .returnNumber
                            }
                        </Head>

                        <Head>
                            {
                                ar.supplierReturns
                                    .purchaseNumber
                            }
                        </Head>

                        <Head>
                            {
                                ar.supplierReturns
                                    .supplier
                            }
                        </Head>

                        <Head>
                            {
                                ar.supplierReturns
                                    .status
                            }
                        </Head>

                        <Head>
                            {
                                ar.supplierReturns
                                    .reason
                            }
                        </Head>

                        <Head>
                            {
                                ar.supplierReturns
                                    .date
                            }
                        </Head>

                        <Head>
                            {
                                ar.supplierReturns
                                    .actions
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
                        returns.map(
                            supplierReturn => (

                                <tr
                                    key={
                                        supplierReturn._id
                                    }
                                    className="
                                        hover:bg-slate-50/70
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
                                                supplierReturn
                                                    .returnNumber
                                            }
                                        </span>

                                    </Cell>


                                    <Cell>

                                        <span
                                            dir="ltr"
                                            className="
                                                font-mono
                                                text-xs
                                            "
                                        >
                                            {
                                                supplierReturn
                                                    .purchaseNumber
                                            }
                                        </span>

                                    </Cell>


                                    <Cell>

                                        <div
                                            className="
                                                font-semibold
                                                text-slate-900
                                            "
                                        >
                                            {
                                                supplierReturn
                                                    .supplier
                                                    ?.name ||
                                                "—"
                                            }
                                        </div>


                                        <div
                                            dir="ltr"
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            {
                                                supplierReturn
                                                    .supplier
                                                    ?.phone ||
                                                ""
                                            }
                                        </div>

                                    </Cell>


                                    <Cell>

                                        <ReturnStatusBadge
                                            status={
                                                supplierReturn
                                                    .status
                                            }
                                        />

                                    </Cell>


                                    <Cell>

                                        <div
                                            className="
                                                max-w-[260px]
                                                truncate
                                            "
                                        >
                                            {
                                                supplierReturn.reason
                                            }
                                        </div>

                                    </Cell>


                                    <Cell>
                                        {
                                            formatDate(
                                                supplierReturn
                                                    .requestedAt ||
                                                supplierReturn
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

                                            <ActionButton
                                                title="عرض التفاصيل"
                                                onClick={
                                                    () =>
                                                        onView(
                                                            supplierReturn
                                                        )
                                                }
                                            >
                                                <Eye size={16} />
                                            </ActionButton>


                                            {
                                                supplierReturn
                                                    .status ===
                                                "requested" &&
                                                (
                                                    <>
                                                        <button
                                                            type="button"
                                                            title="إرسال للمورد"
                                                            onClick={
                                                                () =>
                                                                    onSend(
                                                                        supplierReturn
                                                                    )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-slate-300
                                                                p-2
                                                                text-slate-700
                                                                hover:bg-slate-100
                                                            "
                                                        >
                                                            <Send size={16} />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            title="رفض المرتجع"
                                                            onClick={
                                                                () =>
                                                                    onReject(
                                                                        supplierReturn
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
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
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


function ReturnStatusBadge({
    status,
}) {

    const styles = {

        requested:
            "bg-amber-50 text-amber-700",

        sent:
            "bg-emerald-50 text-emerald-700",

        rejected:
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
                    "bg-slate-100 text-slate-700"
                }
            `}
        >
            {
                ar.supplierReturns[
                    status
                ] ||
                status
            }
        </span>

    );

}


function ActionButton({
    title,
    onClick,
    children,
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
                ar.supplierReturns
                    .noReturns
            }
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
    disabled:cursor-not-allowed
    disabled:opacity-40
`;