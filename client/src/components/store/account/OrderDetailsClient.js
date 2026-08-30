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
    CheckCircle2,
    MapPin,
    Package,
    RefreshCw,
    Truck,
} from "lucide-react";

import SafeImage from
    "@/components/store/SafeImage";

import {
    useAuth,
} from "@/context/AuthContext";

import orderService from
    "@/services/orderService";

import getApiErrorMessage from
    "@/utils/getApiErrorMessage";


import formatCurrency from
    "@/utils/formatCurrency";


const formatDateTime =
    value => {

        if (!value) {
            return "—";
        }


        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                dateStyle:
                    "medium",
                timeStyle:
                    "short",
            }
        ).format(
            new Date(value)
        );

    };


export default function OrderDetailsClient({
    orderNumber,
}) {

    const router =
        useRouter();


    const {
        user,
        loading:
            authLoading,
    } =
        useAuth();


    const [
        order,
        setOrder,
    ] =
        useState(null);


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
        paymentAction,
        setPaymentAction,
    ] =
        useState("");


    const [
        paymentActionError,
        setPaymentActionError,
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
                    `/account/login?next=/account/orders/${encodeURIComponent(
                        orderNumber
                    )}`
                );

            }

        },
        [
            authLoading,
            user,
            router,
            orderNumber,
        ]
    );


    const loadOrder =
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
                            .getMyOrderByNumber(
                                orderNumber
                            );


                    setOrder(
                        response.data
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        "تعذر تحميل تفاصيل الطلب."

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                orderNumber,
                user,
            ]
        );


    useEffect(
        () => {

            if (user) {
                loadOrder();
            }

        },
        [
            user,
            loadOrder,
        ]
    );


    const completeOpayPayment =
        async () => {

            if (!order) {
                return;
            }


            setPaymentAction(
                "pay"
            );

            setPaymentActionError("");


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

                setPaymentActionError(
                    getApiErrorMessage(
                        error,
                        "تعذر استكمال الدفع."
                    )
                );

                setPaymentAction("");

            }

        };


    const cancelPendingOpayOrder =
        async () => {

            if (!order) {
                return;
            }


            const confirmed =
                window.confirm(
                    "هل تريد إلغاء الطلب؟ سيتم إغلاق عملية OPay وإعادة الكمية المحجوزة للمخزون."
                );


            if (!confirmed) {
                return;
            }


            setPaymentAction(
                "cancel"
            );

            setPaymentActionError("");


            try {

                await orderService
                    .closeOpayPayment(
                        order.orderNumber
                    );


                await loadOrder();


            } catch (error) {

                setPaymentActionError(
                    getApiErrorMessage(
                        error,
                        "تعذر إلغاء الطلب."
                    )
                );

            } finally {

                setPaymentAction("");

            }

        };


    if (
        authLoading ||
        !user
    ) {

        return (
            <LoadingPage />
        );

    }


    if (loading) {

        return (
            <LoadingPage />
        );

    }


    if (
        error ||
        !order
    ) {

        return (

            <ErrorState
                message={
                    error ||
                    "الطلب غير موجود."
                }
                onRetry={
                    loadOrder
                }
            />

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
                        href="/account/orders"
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

                        العودة إلى الطلبات
                    </Link>


                    <div
                        className="
                            mt-5
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    text-sm
                                    text-[#6B6862]
                                "
                            >
                                رقم الطلب
                            </div>


                            <h1
                                dir="ltr"
                                className="
                                    mt-1
                                    font-mono
                                    text-2xl
                                    font-black
                                    text-[#252525]
                                    sm:text-3xl
                                "
                            >
                                {
                                    order.orderNumber
                                }
                            </h1>

                        </div>


                        <OrderStatusBadge
                            status={
                                order.status
                            }
                        />

                    </div>


                    <div
                        className="
                            mt-3
                            text-sm
                            text-[#6B6862]
                        "
                    >
                        تم إنشاء الطلب في{" "}
                        {
                            formatDateTime(
                                order.createdAt
                            )
                        }
                    </div>

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

                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[minmax(0,1fr)_360px]
                        lg:items-start
                    "
                >

                    <div
                        className="
                            space-y-6
                        "
                    >

                        <OrderItems
                            items={
                                order.items ||
                                []
                            }
                        />


                        <ShippingAddress
                            address={
                                order.shippingAddress
                            }
                        />

                    </div>


                    <OrderSummary
                        order={order}
                        paymentAction={
                            paymentAction
                        }
                        paymentActionError={
                            paymentActionError
                        }
                        onCompletePayment={
                            completeOpayPayment
                        }
                        onCancelPayment={
                            cancelPendingOpayOrder
                        }
                    />

                </div>

            </section>

        </>

    );

}


function OrderItems({
    items,
}) {

    return (

        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FFFEFC]
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-[#E7E0D5]
                    px-5
                    py-4
                "
            >

                <Package
                    size={19}
                    className="
                        text-[#6B6862]
                    "
                />


                <h2
                    className="
                        font-black
                        text-[#252525]
                    "
                >
                    منتجات الطلب
                </h2>

            </div>


            <div
                className="
                    divide-y
                    divide-[#EFE9E0]
                "
            >

                {
                    items.map(
                        item => (

                            <OrderItem
                                key={
                                    item.product
                                }
                                item={
                                    item
                                }
                            />

                        )
                    )
                }

            </div>

        </section>

    );

}


function OrderItem({
    item,
}) {

    const price =
        Number(
            item.pricing
                ?.finalPrice
        ) || 0;


    const total =
        price *
        item.quantity;


    return (

        <div
            className="
                flex
                gap-4
                p-4
                sm:p-5
            "
        >

            <div
                className="
                    flex
                    h-20
                    w-20
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#E7E0D5]
                    bg-[#FAF6EE]
                "
            >

                {
                    item.image?.url
                        ? (

                            <SafeImage
                                src={
                                    item.image.url
                                }
                                alt={
                                    item.title
                                }
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                    p-2
                                "
                            />

                        )
                        : (

                            <Package
                                size={28}
                                className="
                                    text-[#B8B0A5]
                                "
                            />

                        )
                }

            </div>


            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <div
                    className="
                        text-sm
                        font-black
                        leading-6
                        text-[#252525]
                    "
                >
                    {item.title}
                </div>


                <div
                    className="
                        mt-1
                        text-xs
                        text-[#8A857D]
                    "
                >

                    {
                        item.brand &&
                        <>
                            {
                                item.brand
                            }
                            {" • "}
                        </>
                    }

                    <span
                        dir="ltr"
                        className="
                            font-mono
                        "
                    >
                        {item.sku}
                    </span>

                </div>


                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <div
                        className="
                            text-xs
                            text-[#6B6862]
                        "
                    >
                        الكمية:{" "}
                        <strong
                            className="
                                text-[#3C3935]
                            "
                        >
                            {item.quantity}
                        </strong>
                    </div>


                    <div
                        className="
                            text-left
                        "
                    >

                        <div
                            className="
                                text-xs
                                text-[#8A857D]
                            "
                        >
                            {
                                formatCurrency(
                                    price
                                )
                            }
                            {" × "}
                            {item.quantity}
                        </div>


                        <div
                            className="
                                mt-1
                                text-sm
                                font-black
                                text-[#252525]
                            "
                        >
                            {
                                formatCurrency(
                                    total
                                )
                            }
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


function ShippingAddress({
    address,
}) {

    if (!address) {
        return null;
    }


    return (

        <section
            className="
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FFFEFC]
                p-5
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <MapPin
                    size={19}
                    className="
                        text-[#6B6862]
                    "
                />


                <h2
                    className="
                        font-black
                        text-[#252525]
                    "
                >
                    عنوان الشحن
                </h2>

            </div>


            <div
                className="
                    mt-5
                    grid
                    gap-4
                    sm:grid-cols-2
                "
            >

                <Info
                    label="المحافظة"
                    value={
                        address.governorate
                    }
                />


                <Info
                    label="المدينة / المنطقة"
                    value={
                        address.city
                    }
                />


                <div
                    className="
                        sm:col-span-2
                    "
                >
                    <Info
                        label="العنوان"
                        value={
                            address.address
                        }
                    />
                </div>


                {
                    address.landmark &&
                    (

                        <div
                            className="
                                sm:col-span-2
                            "
                        >
                            <Info
                                label="علامة مميزة"
                                value={
                                    address.landmark
                                }
                            />
                        </div>

                    )
                }

            </div>

        </section>

    );

}


function OrderSummary({
    order,
    paymentAction,
    paymentActionError,
    onCompletePayment,
    onCancelPayment,
}) {

    const pendingOpay =
        order.payment
            ?.method ===
            "opay" &&
        order.payment
            ?.status ===
            "pending" &&
        order.status !==
            "cancelled";

    return (

        <aside
            className="
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FFFEFC]
                p-5
                lg:sticky
                lg:top-5
            "
        >

            <h2
                className="
                    text-lg
                    font-black
                    text-[#252525]
                "
            >
                ملخص الطلب
            </h2>


            <div
                className="
                    mt-5
                    divide-y
                    divide-[#EFE9E0]
                "
            >

                <SummaryRow
                    label="إجمالي المنتجات"
                    value={
                        formatCurrency(
                            order.totals
                                ?.subtotal
                        )
                    }
                />


                <SummaryRow
                    label="الخصم"
                    value={
                        formatCurrency(
                            order.totals
                                ?.discount
                        )
                    }
                />


                <SummaryRow
                    label="الشحن"
                    value={
                        formatCurrency(
                            order.totals
                                ?.shipping
                        )
                    }
                />

            </div>


            <div
                className="
                    mt-4
                    border-t
                    border-[#E7E0D5]
                    pt-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <span
                        className="
                            font-black
                            text-[#252525]
                        "
                    >
                        الإجمالي
                    </span>


                    <span
                        className="
                            text-xl
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
                    </span>

                </div>

            </div>


            {(Number(order.loyalty?.pointsRedeemed || 0) > 0 || Number(order.loyalty?.pointsPending || 0) > 0 || Number(order.loyalty?.pointsAwarded || 0) > 0) && (
                <div className="mt-5 rounded-xl border border-[#F0DFC0] bg-[#FFF9EB] p-4">
                    <div className="text-sm font-black text-[#252525]">نقاط الولاء</div>
                    <div className="mt-3 space-y-2 text-xs text-[#6B6862]">
                        {Number(order.loyalty?.pointsRedeemed || 0) > 0 && <LoyaltyInfoRow label="نقاط مستخدمة" value={`${order.loyalty.pointsRedeemed} نقطة`} />}
                        {Number(order.loyalty?.redemptionAmount || 0) > 0 && <LoyaltyInfoRow label="قيمة خصم النقاط" value={formatCurrency(order.loyalty.redemptionAmount)} />}
                        {Number(order.loyalty?.pointsAwarded || 0) > 0 ? <LoyaltyInfoRow label="نقاط مكتسبة" value={`${order.loyalty.pointsAwarded} نقطة متاحة`} /> : Number(order.loyalty?.pointsPending || 0) > 0 && !order.loyalty?.pendingCancelled && <LoyaltyInfoRow label="نقاط متوقعة" value={`${order.loyalty.pointsPending} نقطة — تتاح بعد التسليم`} />}
                        {Number(order.loyalty?.pointsReversed || 0) > 0 && <LoyaltyInfoRow label="نقاط تم عكسها بعد مرتجع" value={`${order.loyalty.pointsReversed} نقطة`} />}
                    </div>
                </div>
            )}


            <div
                className="
                    mt-6
                    space-y-3
                    rounded-xl
                    bg-[#FAF6EE]
                    p-4
                "
            >

                <SummaryInfo
                    icon={
                        CheckCircle2
                    }
                    label="طريقة الدفع"
                    value={
                        order.payment
                            ?.method ===
                        "cod"
                            ? "الدفع عند الاستلام"
                            : order.payment
                                ?.method ===
                                "opay"
                                ? "الدفع الإلكتروني عبر OPay"
                                : order.payment
                                    ?.method ||
                                "—"
                    }
                />


                <SummaryInfo
                    icon={
                        Truck
                    }
                    label="حالة الدفع"
                    value={
                        paymentStatusLabel(
                            order.payment
                                ?.status
                        )
                    }
                />

            </div>


            {
                pendingOpay &&
                (
                    <div
                        className="
                            mt-6
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            p-4
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
                                text-amber-800/80
                            "
                        >
                            يمكنك إكمال الدفع أو إلغاء الطلب وإعادة الكمية المحجوزة للمخزون.
                        </p>


                        <div
                            className="
                                mt-4
                                space-y-2
                            "
                        >

                            <button
                                type="button"
                                disabled={
                                    Boolean(
                                        paymentAction
                                    )
                                }
                                onClick={
                                    onCompletePayment
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#1F4E5F]
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    disabled:opacity-60
                                "
                            >
                                {
                                    paymentAction ===
                                    "pay"
                                        ? "جاري فتح OPay..."
                                        : "إكمال الدفع عبر OPay"
                                }
                            </button>


                            <button
                                type="button"
                                disabled={
                                    Boolean(
                                        paymentAction
                                    )
                                }
                                onClick={
                                    onCancelPayment
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-red-700
                                    disabled:opacity-60
                                "
                            >
                                {
                                    paymentAction ===
                                    "cancel"
                                        ? "جاري الإلغاء..."
                                        : "إلغاء الطلب"
                                }
                            </button>

                        </div>


                        {
                            paymentActionError &&
                            (
                                <div
                                    className="
                                        mt-3
                                        rounded-lg
                                        bg-red-100
                                        px-3
                                        py-2
                                        text-xs
                                        leading-5
                                        text-red-700
                                    "
                                >
                                    {paymentActionError}
                                </div>
                            )
                        }

                    </div>
                )
            }


            {
                order.status ===
                "delivered" &&
                (

                    <Link
                        href={
                            `/account/orders/${order.orderNumber}/return`
                        }
                        className="
                            mt-6
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#D9D0C4]
                            bg-[#FFFEFC]
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-[#56524D]
                            transition
                            hover:bg-[#FAF6EE]
                        "
                    >
                        طلب إرجاع منتج
                    </Link>

                )
            }

        </aside>

    );

}


function OrderStatusBadge({
    status,
}) {

    const config = {

        pending: [
            "قيد الانتظار",
            "bg-amber-50 text-amber-700",
        ],

        confirmed: [
            "تم التأكيد",
            "bg-blue-50 text-blue-700",
        ],

        processing: [
            "جاري التجهيز",
            "bg-indigo-50 text-indigo-700",
        ],

        packed: [
            "تم التجهيز",
            "bg-violet-50 text-violet-700",
        ],

        shipped: [
            "تم الشحن",
            "bg-sky-50 text-sky-700",
        ],

        delivered: [
            "تم التسليم",
            "bg-emerald-50 text-emerald-700",
        ],

        cancelled: [
            "ملغي",
            "bg-red-50 text-red-700",
        ],

    };


    const [
        label,
        style,
    ] =
        config[status] ||
        [
            status,
            "bg-[#F4EDE2] text-[#56524D]",
        ];


    return (

        <span
            className={`
                inline-flex
                w-fit
                rounded-full
                px-3
                py-1.5
                text-xs
                font-black
                ${style}
            `}
        >
            {label}
        </span>

    );

}


function paymentStatusLabel(
    status
) {

    const labels = {

        pending:
            "قيد الانتظار",

        paid:
            "تم الدفع",

        failed:
            "فشل الدفع",

        refunded:
            "تم رد المبلغ",

    };


    return (
        labels[status] ||
        status ||
        "—"
    );

}


function Info({
    label,
    value,
}) {

    return (

        <div
            className="
                rounded-xl
                bg-[#FAF6EE]
                p-4
            "
        >

            <div
                className="
                    text-xs
                    text-[#6B6862]
                "
            >
                {label}
            </div>


            <div
                className="
                    mt-2
                    whitespace-pre-wrap
                    text-sm
                    font-semibold
                    leading-6
                    text-[#252525]
                "
            >
                {value || "—"}
            </div>

        </div>

    );

}


function LoyaltyInfoRow({ label, value }) {
    return <div className="flex items-center justify-between gap-4"><span>{label}</span><strong className="text-left text-[#252525]">{value}</strong></div>;
}


function SummaryRow({
    label,
    value,
}) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-4
                py-3
                text-sm
            "
        >

            <span
                className="
                    text-[#6B6862]
                "
            >
                {label}
            </span>


            <span
                className="
                    font-bold
                    text-[#3C3935]
                "
            >
                {value}
            </span>

        </div>

    );

}


function SummaryInfo({
    icon: Icon,
    label,
    value,
}) {

    return (

        <div
            className="
                flex
                items-start
                gap-3
            "
        >

            <Icon
                size={17}
                className="
                    mt-0.5
                    shrink-0
                    text-[#6B6862]
                "
            />


            <div>

                <div
                    className="
                        text-[11px]
                        text-[#8A857D]
                    "
                >
                    {label}
                </div>


                <div
                    className="
                        mt-1
                        text-xs
                        font-bold
                        text-[#3C3935]
                    "
                >
                    {value}
                </div>

            </div>

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
            "
        >

            <div
                className="
                    text-center
                "
            >

                <RefreshCw
                    size={28}
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
                    جاري تحميل الطلب...
                </div>

            </div>

        </div>

    );

}


function ErrorState({
    message,
    onRetry,
}) {

    return (

        <section
            className="
                mx-auto
                max-w-7xl
                px-4
                py-16
                sm:px-6
                lg:px-8
            "
        >

            <div
                className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    px-6
                    py-12
                    text-center
                "
            >

                <div
                    className="
                        text-lg
                        font-black
                        text-red-800
                    "
                >
                    تعذر عرض الطلب
                </div>


                <p
                    className="
                        mt-2
                        text-sm
                        text-red-700
                    "
                >
                    {message}
                </p>


                <div
                    className="
                        mt-5
                        flex
                        justify-center
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={
                            onRetry
                        }
                        className="
                            rounded-xl
                            bg-red-700
                            px-5
                            py-2.5
                            text-sm
                            font-bold
                            text-white
                        "
                    >
                        إعادة المحاولة
                    </button>


                    <Link
                        href="/account/orders"
                        className="
                            rounded-xl
                            border
                            border-red-300
                            bg-[#FFFEFC]
                            px-5
                            py-2.5
                            text-sm
                            font-bold
                            text-red-700
                        "
                    >
                        طلباتي
                    </Link>

                </div>

            </div>

        </section>

    );

}