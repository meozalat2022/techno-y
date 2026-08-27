"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    useRouter,
} from "next/navigation";

import {
    ArrowLeft,
    CreditCard,
    PackageSearch,
    RefreshCw,
    XCircle,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";

import orderService from
    "@/services/orderService";

import getApiErrorMessage from
    "@/utils/getApiErrorMessage";


import formatCurrency from
    "@/utils/formatCurrency";


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


export default function MyOrdersPage() {

    const router =
        useRouter();


    const {
        user,
        loading:
            authLoading,
    } =
        useAuth();


    const [
        orders,
        setOrders,
    ] =
        useState([]);


    const [
        meta,
        setMeta,
    ] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            pages: 1,
        });


    const [
        page,
        setPage,
    ] =
        useState(1);


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


    useEffect(
        () => {

            if (
                authLoading
            ) {
                return;
            }


            if (!user) {

                router.replace(
                    "/account/login?next=/account/orders"
                );

            }

        },
        [
            authLoading,
            user,
            router,
        ]
    );


    const loadOrders =
        useCallback(
            async () => {

                if (!user) {
                    return;
                }


                setLoading(true);

                setError("");


                try {

                    const response =
                        await orderService
                            .getMyOrders({
                                page,
                                limit: 10,
                            });


                    const result =
                        response.data ||
                        {};


                    setOrders(
                        result.orders ||
                        []
                    );


                    setMeta(
                        result.meta ||
                        {
                            page: 1,
                            limit: 10,
                            total: 0,
                            pages: 1,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        "تعذر تحميل الطلبات."

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                page,
                user,
            ]
        );


    useEffect(
        () => {

            if (user) {
                loadOrders();
            }

        },
        [
            user,
            loadOrders,
        ]
    );


    if (
        authLoading ||
        !user
    ) {

        return (
            <LoadingPage />
        );

    }


    return (

        <>

            <section
                className="
                    border-b
                    border-[#E7E0D5]
                    bg-[#FAF6EE]
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        py-10
                        sm:px-6
                        lg:px-8
                    "
                >

                    <Link
                        href="/account"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-bold
                            text-[#6B6862]
                            hover:text-[#252525]
                        "
                    >
                        <ArrowLeft
                            size={16}
                            className="
                                rotate-180
                            "
                        />

                        العودة إلى حسابي
                    </Link>


                    <h1
                        className="
                            mt-4
                            text-3xl
                            font-black
                            text-[#252525]
                        "
                    >
                        طلباتي
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-[#6B6862]
                        "
                    >
                        تابع حالة طلباتك السابقة
                        والحالية.
                    </p>

                </div>

            </section>


            <section
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >

                {error && (

                    <div
                        className="
                            mb-5
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>

                )}


                {
                    loading
                        ? (
                            <OrdersLoading />
                        )
                        : orders.length ===
                            0
                            ? (
                                <EmptyOrders />
                            )
                            : (

                                <div
                                    className="
                                        space-y-4
                                    "
                                >

                                    {
                                        orders.map(
                                            order => (

                                                <OrderCard
                                                    key={
                                                        order._id ||
                                                        order.orderNumber
                                                    }
                                                    order={
                                                        order
                                                    }
                                                    onChanged={
                                                        loadOrders
                                                    }
                                                />

                                            )
                                        )
                                    }

                                </div>

                            )
                }


                {
                    !loading &&
                    meta.pages >
                    1 &&
                    (

                        <div
                            className="
                                mt-8
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    text-[#6B6862]
                                "
                            >
                                صفحة{" "}
                                {meta.page}{" "}
                                من{" "}
                                {meta.pages}
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
                                    className={
                                        pageButtonClass
                                    }
                                >
                                    السابق
                                </button>


                                <button
                                    type="button"
                                    disabled={
                                        page >=
                                        meta.pages
                                    }
                                    onClick={
                                        () =>
                                            setPage(
                                                previous =>
                                                    previous +
                                                    1
                                            )
                                    }
                                    className={
                                        pageButtonClass
                                    }
                                >
                                    التالي
                                </button>

                            </div>

                        </div>

                    )
                }

            </section>

        </>

    );

}


function OrderCard({
    order,
    onChanged,
}) {

    const [
        action,
        setAction,
    ] =
        useState("");


    const [
        actionError,
        setActionError,
    ] =
        useState("");


    const pendingOpay =
        order.payment
            ?.method ===
            "opay" &&
        order.payment
            ?.status ===
            "pending" &&
        order.status !==
            "cancelled";


    const completePayment =
        async () => {

            setAction(
                "pay"
            );

            setActionError("");


            try {

                const response =
                    await orderService
                        .createOpayPayment(
                            order.orderNumber
                        );


                const cashierUrl =
                    response.data
                        ?.cashierUrl;


                if (!cashierUrl) {

                    throw new Error(
                        "لم يتم استلام رابط الدفع من OPay."
                    );

                }


                window.sessionStorage
                    .setItem(
                        "technoy-opay-pending-order",
                        order.orderNumber
                    );


                window.location.assign(
                    cashierUrl
                );


            } catch (error) {

                setActionError(
                    getApiErrorMessage(
                        error,
                        "تعذر استكمال الدفع."
                    )
                );

                setAction("");

            }

        };


    const cancelPayment =
        async () => {

            const confirmed =
                window.confirm(
                    "هل تريد إلغاء الطلب؟ سيتم إغلاق عملية OPay وإعادة الكمية المحجوزة للمخزون."
                );


            if (!confirmed) {
                return;
            }


            setAction(
                "cancel"
            );

            setActionError("");


            try {

                await orderService
                    .closeOpayPayment(
                        order.orderNumber
                    );


                await onChanged();


            } catch (error) {

                setActionError(
                    getApiErrorMessage(
                        error,
                        "تعذر إلغاء الطلب."
                    )
                );

            } finally {

                setAction("");

            }

        };


    return (

        <div
            className="
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FFFEFC]
                p-5
                transition
                hover:border-[#D9D0C4]
                hover:shadow-sm
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                        "
                    >

                        <Link
                            href={
                                `/account/orders/${order.orderNumber}`
                            }
                            dir="ltr"
                            className="
                                font-mono
                                text-base
                                font-black
                                text-[#252525]
                                hover:text-[#1F4E5F]
                            "
                        >
                            {order.orderNumber}
                        </Link>


                        <OrderStatusBadge
                            status={
                                order.status
                            }
                        />


                        {
                            order.payment
                                ?.method ===
                                "opay" &&
                            (
                                <PaymentStatusBadge
                                    status={
                                        order.payment
                                            ?.status
                                    }
                                />
                            )
                        }

                    </div>


                    <div
                        className="
                            mt-3
                            text-sm
                            text-[#6B6862]
                        "
                    >
                        {
                            formatDate(
                                order.createdAt
                            )
                        }
                    </div>

                </div>


                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-6
                        sm:justify-end
                    "
                >

                    <div>

                        <div
                            className="
                                text-xs
                                text-[#8A857D]
                            "
                        >
                            إجمالي الطلب
                        </div>


                        <div
                            className="
                                mt-1
                                text-lg
                                font-black
                                text-[#252525]
                            "
                        >
                            {
                                formatCurrency(
                                    order.totals
                                        ?.total
                                )
                            }
                        </div>

                    </div>


                    <Link
                        href={
                            `/account/orders/${order.orderNumber}`
                        }
                        aria-label="عرض تفاصيل الطلب"
                        className="
                            text-[#8A857D]
                            hover:text-[#1F4E5F]
                        "
                    >
                        <ArrowLeft
                            size={19}
                        />
                    </Link>

                </div>

            </div>


            {
                pendingOpay &&
                (
                    <div
                        className="
                            mt-5
                            border-t
                            border-[#EFE9E0]
                            pt-4
                        "
                    >

                        <div
                            className="
                                text-sm
                                font-black
                                text-amber-800
                            "
                        >
                            الدفع لم يكتمل بعد
                        </div>


                        <p
                            className="
                                mt-1
                                text-xs
                                leading-6
                                text-[#6B6862]
                            "
                        >
                            يمكنك إكمال الدفع عبر OPay أو إلغاء الطلب لتحرير الكمية المحجوزة.
                        </p>


                        <div
                            className="
                                mt-4
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                            "
                        >

                            <button
                                type="button"
                                disabled={
                                    Boolean(
                                        action
                                    )
                                }
                                onClick={
                                    completePayment
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#1F4E5F]
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-black
                                    text-white
                                    disabled:opacity-60
                                "
                            >
                                <CreditCard
                                    size={16}
                                />

                                {
                                    action ===
                                    "pay"
                                        ? "جاري فتح OPay..."
                                        : "إكمال الدفع"
                                }
                            </button>


                            <button
                                type="button"
                                disabled={
                                    Boolean(
                                        action
                                    )
                                }
                                onClick={
                                    cancelPayment
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-black
                                    text-red-700
                                    disabled:opacity-60
                                "
                            >
                                <XCircle
                                    size={16}
                                />

                                {
                                    action ===
                                    "cancel"
                                        ? "جاري الإلغاء..."
                                        : "إلغاء الطلب"
                                }
                            </button>

                        </div>


                        {
                            actionError &&
                            (
                                <div
                                    className="
                                        mt-3
                                        rounded-xl
                                        bg-red-50
                                        px-3
                                        py-2
                                        text-xs
                                        leading-5
                                        text-red-700
                                    "
                                >
                                    {actionError}
                                </div>
                            )
                        }

                    </div>
                )
            }

        </div>

    );

}


function PaymentStatusBadge({
    status,
}) {

    const config = {

        pending: [
            "الدفع قيد الانتظار",
            "bg-amber-50 text-amber-700",
        ],

        paid: [
            "تم الدفع",
            "bg-emerald-50 text-emerald-700",
        ],

        failed: [
            "فشل الدفع",
            "bg-red-50 text-red-700",
        ],

        refunded: [
            "تم رد المبلغ",
            "bg-blue-50 text-blue-700",
        ],

    };


    const [
        label,
        style,
    ] =
        config[status] ||
        [
            status || "—",
            "bg-[#F4EDE2] text-[#56524D]",
        ];


    return (

        <span
            className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-bold
                ${style}
            `}
        >
            {label}
        </span>

    );

}


function OrderStatusBadge({
    status,
}) {

    const config = {

        pending: {
            label:
                "قيد الانتظار",
            style:
                "bg-amber-50 text-amber-700",
        },

        confirmed: {
            label:
                "تم التأكيد",
            style:
                "bg-blue-50 text-blue-700",
        },

        processing: {
            label:
                "جاري التجهيز",
            style:
                "bg-indigo-50 text-indigo-700",
        },

        packed: {
            label:
                "تم التجهيز",
            style:
                "bg-violet-50 text-violet-700",
        },

        shipped: {
            label:
                "تم الشحن",
            style:
                "bg-sky-50 text-sky-700",
        },

        delivered: {
            label:
                "تم التسليم",
            style:
                "bg-emerald-50 text-emerald-700",
        },

        cancelled: {
            label:
                "ملغي",
            style:
                "bg-red-50 text-red-700",
        },

    };


    const current =
        config[status] ||
        {
            label: status,
            style:
                "bg-[#F4EDE2] text-[#56524D]",
        };


    return (

        <span
            className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-bold
                ${current.style}
            `}
        >
            {current.label}
        </span>

    );

}


function OrdersLoading() {

    return (

        <div
            className="
                flex
                min-h-[320px]
                items-center
                justify-center
            "
        >

            <div
                className="
                    text-center
                "
            >

                <RefreshCw
                    size={27}
                    className="
                        mx-auto
                        animate-spin
                        text-[#8A857D]
                    "
                />


                <div
                    className="
                        mt-3
                        text-sm
                        text-[#6B6862]
                    "
                >
                    جاري تحميل الطلبات...
                </div>

            </div>

        </div>

    );

}


function EmptyOrders() {

    return (

        <div
            className="
                rounded-3xl
                border
                border-dashed
                border-[#D9D0C4]
                bg-[#FFFEFC]
                px-6
                py-16
                text-center
            "
        >

            <PackageSearch
                size={42}
                className="
                    mx-auto
                    text-[#B8B0A5]
                "
            />


            <h2
                className="
                    mt-4
                    text-xl
                    font-black
                    text-[#252525]
                "
            >
                لسه مفيش طلبات هنا
            </h2>


            <p
                className="
                    mt-2
                    text-sm
                    text-[#6B6862]
                "
            >
                أول ما تعمل طلب من تكنو-واي هتلاقيه هنا وتقدر تتابع حالته بسهولة.
            </p>


            <Link
                href="/products"
                className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#1F4E5F]
                    px-6
                    py-3
                    text-sm
                    font-black
                    text-white
                "
            >
                تصفح المنتجات

                <ArrowLeft
                    size={17}
                />
            </Link>

        </div>

    );

}


function LoadingPage() {

    return (

        <div
            className="
                flex
                min-h-[500px]
                items-center
                justify-center
                text-sm
                text-[#6B6862]
            "
        >
            جاري تحميل حسابك...
        </div>

    );

}


const pageButtonClass = `
    rounded-xl
    border
    border-[#D9D0C4]
    bg-[#FFFEFC]
    px-4
    py-2.5
    text-sm
    font-bold
    text-[#56524D]
    disabled:cursor-not-allowed
    disabled:opacity-40
`;