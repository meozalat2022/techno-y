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
    Settings2,
} from "lucide-react";

import orderService from
    "@/services/orderService";

import OrderDetailsModal from
    "@/components/admin/orders/OrderDetailsModal";

import OrderStatusModal from
    "@/components/admin/orders/OrderStatusModal";

import ar from
    "@/locales/ar";


const formatCurrency =
    value =>
        new Intl.NumberFormat(
            "ar-EG",
            {
                style: "currency",
                currency: "EGP",
                maximumFractionDigits: 2,
            }
        ).format(
            Number(value) || 0
        );


const formatDate =
    value =>
        new Intl.DateTimeFormat(
            "ar-EG",
            {
                dateStyle: "medium",
            }
        ).format(
            new Date(value)
        );


export default function OrdersPage() {

    const [
        orders,
        setOrders,
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
        detailsOrder,
        setDetailsOrder,
    ] =
        useState(null);


    const [
        statusOrder,
        setStatusOrder,
    ] =
        useState(null);


    const loadOrders =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await orderService
                            .getOrders({

                                page,

                                limit: 20,

                                search,

                                status,

                            });


                    setOrders(
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
                        ar.orders.loadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                page,
                search,
                status,
            ]
        );


    useEffect(
        () => {

            loadOrders();

        },
        [
            loadOrders,
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


    const handleView =
        async order => {

            setError("");


            try {

                const response =
                    await orderService
                        .getOrderByNumber(
                            order.orderNumber
                        );


                setDetailsOrder(
                    response.data
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.orders
                        .detailsError

                );

            }

        };


    const handleOpenStatus =
        async order => {

            setError("");


            try {

                const response =
                    await orderService
                        .getOrderByNumber(
                            order.orderNumber
                        );


                setStatusOrder(
                    response.data
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.orders
                        .detailsError

                );

            }

        };


    const handleUpdateStatus =
        async newStatus => {

            if (!statusOrder) {
                return;
            }


            const confirmed =
                window.confirm(
                    ar.orders
                        .confirmStatusChange
                );


            if (!confirmed) {
                return;
            }


            setSaving(true);

            setError("");

            setMessage("");


            try {

                await orderService
                    .updateOrderStatus(

                        statusOrder
                            .orderNumber,

                        newStatus

                    );


                setStatusOrder(
                    null
                );


                setMessage(
                    ar.orders
                        .statusSuccess
                );


                await loadOrders();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.orders
                        .statusError

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
                    {ar.orders.title}
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    {
                        ar.orders.description
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
                        lg:grid-cols-[2fr_1fr]
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
                                    ar.orders
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
                                    event.target
                                        .value
                                );

                            }
                        }
                        className="
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            py-2.5
                            text-sm
                        "
                    >

                        <option value="">
                            {
                                ar.orders
                                    .allStatuses
                            }
                        </option>

                        <option value="pending">
                            قيد الانتظار
                        </option>

                        <option value="confirmed">
                            تم التأكيد
                        </option>

                        <option value="processing">
                            جاري التجهيز
                        </option>

                        <option value="packed">
                            تم التجهيز
                        </option>

                        <option value="shipped">
                            تم الشحن
                        </option>

                        <option value="delivered">
                            تم التسليم
                        </option>

                        <option value="cancelled">
                            ملغي
                        </option>

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
                        : orders.length ===
                            0
                            ? (
                                <EmptyState />
                            )
                            : (

                                <OrdersTable
                                    orders={
                                        orders
                                    }
                                    onView={
                                        handleView
                                    }
                                    onStatus={
                                        handleOpenStatus
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
                                                previous -
                                                1
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
                                                previous +
                                                1
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


            <OrderDetailsModal
                open={
                    Boolean(
                        detailsOrder
                    )
                }
                order={
                    detailsOrder
                }
                onClose={
                    () =>
                        setDetailsOrder(
                            null
                        )
                }
            />


            <OrderStatusModal
                open={
                    Boolean(
                        statusOrder
                    )
                }
                order={
                    statusOrder
                }
                saving={
                    saving
                }
                onClose={
                    () =>
                        setStatusOrder(
                            null
                        )
                }
                onSubmit={
                    handleUpdateStatus
                }
            />

        </div>

    );

}


function OrdersTable({
    orders,
    onView,
    onStatus,
}) {

    return (

        <div className="overflow-x-auto">

            <table
                className="
                    w-full
                    min-w-[950px]
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
                                ar.orders
                                    .orderNumber
                            }
                        </Head>

                        <Head>
                            {
                                ar.orders.customer
                            }
                        </Head>

                        <Head>
                            {
                                ar.orders.phone
                            }
                        </Head>

                        <Head>
                            {
                                ar.orders.status
                            }
                        </Head>

                        <Head>
                            {
                                ar.orders.total
                            }
                        </Head>

                        <Head>
                            {
                                ar.orders.date
                            }
                        </Head>

                        <Head>
                            {
                                ar.orders.actions
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
                        orders.map(
                            order => {

                                const terminal =
                                    [
                                        "delivered",
                                        "cancelled",
                                    ].includes(
                                        order.status
                                    );


                                return (

                                    <tr
                                        key={
                                            order._id
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
                                                    order
                                                        .orderNumber
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
                                                    `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() ||
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
                                                    order.customer
                                                        ?.email ||
                                                    ""
                                                }
                                            </div>

                                        </Cell>


                                        <Cell>

                                            <span dir="ltr">
                                                {
                                                    order.customer
                                                        ?.phone ||
                                                    "—"
                                                }
                                            </span>

                                        </Cell>


                                        <Cell>

                                            <OrderStatusBadge
                                                status={
                                                    order.status
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
                                                        order.totals
                                                            ?.total
                                                    )
                                                }
                                            </strong>

                                        </Cell>


                                        <Cell>
                                            {
                                                formatDate(
                                                    order.createdAt
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
                                                                order
                                                            )
                                                    }
                                                >
                                                    <Eye size={16} />
                                                </ActionButton>


                                                {
                                                    !terminal &&
                                                    (

                                                        <ActionButton
                                                            title="تحديث الحالة"
                                                            onClick={
                                                                () =>
                                                                    onStatus(
                                                                        order
                                                                    )
                                                            }
                                                        >
                                                            <Settings2
                                                                size={16}
                                                            />
                                                        </ActionButton>

                                                    )
                                                }

                                            </div>

                                        </Cell>

                                    </tr>

                                );

                            }
                        )
                    }

                </tbody>

            </table>

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
                ar.orders[
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
            {ar.orders.noOrders}
        </div>

    );

}


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