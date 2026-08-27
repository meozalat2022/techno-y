"use client";


import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import Link from "next/link";

import {
    CheckCircle2,
    Clock3,
    RefreshCw,
    ShieldCheck,
    XCircle,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";

import {
    useCart,
} from "@/context/CartContext";

import orderService from
    "@/services/orderService";


const STORAGE_KEY =
    "technoy-opay-pending-order";


export default function OpayReturnPage() {

    const {
        user,
        loading:
            authLoading,
    } =
        useAuth();


    const {
        clearCart,
        hydrated,
    } =
        useCart();


    const [
        orderNumber,
        setOrderNumber,
    ] =
        useState("");


    const [
        result,
        setResult,
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


    const clearedRef =
        useRef(false);


    useEffect(
        () => {

            if (
                typeof window ===
                "undefined"
            ) {
                return;
            }


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const value =
                window.sessionStorage
                    .getItem(
                        STORAGE_KEY
                    ) ||
                params.get(
                    "reference"
                ) ||
                params.get(
                    "orderNumber"
                ) ||
                "";


            setOrderNumber(
                value
            );

        },
        []
    );


    const verifyPayment =
        useCallback(
            async () => {

                if (
                    !user ||
                    !orderNumber
                ) {
                    return;
                }


                setLoading(true);

                setError("");


                try {

                    const response =
                        await orderService
                            .getOpayPaymentStatus(
                                orderNumber
                            );


                    const data =
                        response.data;


                    setResult(
                        data
                    );


                    if (
                        data.paymentStatus ===
                        "paid"
                    ) {

                        if (
                            !clearedRef.current
                        ) {

                            clearCart();

                            clearedRef.current =
                                true;

                        }


                        window.sessionStorage
                            .removeItem(
                                STORAGE_KEY
                            );

                    }


                    if (
                        [
                            "failed",
                            "refunded",
                        ].includes(
                            data.paymentStatus
                        ) ||
                        data.orderStatus ===
                            "cancelled"
                    ) {

                        window.sessionStorage
                            .removeItem(
                                STORAGE_KEY
                            );

                    }


                } catch (error) {

                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "تعذر التحقق من حالة الدفع. حاول مرة أخرى."
                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                user,
                orderNumber,
                clearCart,
            ]
        );


    useEffect(
        () => {

            if (
                authLoading ||
                !hydrated ||
                !user ||
                !orderNumber
            ) {
                return;
            }


            verifyPayment();

        },
        [
            authLoading,
            hydrated,
            user,
            orderNumber,
            verifyPayment,
        ]
    );


    if (
        authLoading ||
        !hydrated ||
        (
            loading &&
            !result
        )
    ) {

        return (
            <StateCard
                icon={
                    RefreshCw
                }
                iconClass="animate-spin text-[#1F4E5F]"
                title="جاري التحقق من الدفع..."
                description="نتأكد من حالة العملية مباشرة من OPay قبل تأكيد الدفع."
            />
        );

    }


    if (!user) {

        return (
            <StateCard
                icon={
                    ShieldCheck
                }
                iconClass="text-[#1F4E5F]"
                title="سجّل الدخول لمتابعة الدفع"
                description="نحتاج حسابك للتحقق من الطلب المرتبط بعملية الدفع."
            >
                <Link
                    href="/account/login?next=/payment/opay/return"
                    className="
                        inline-flex
                        rounded-xl
                        bg-[#1F4E5F]
                        px-6
                        py-3
                        text-sm
                        font-black
                        text-white
                    "
                >
                    تسجيل الدخول
                </Link>
            </StateCard>
        );

    }


    if (!orderNumber) {

        return (
            <StateCard
                icon={
                    XCircle
                }
                iconClass="text-[#C94A45]"
                title="تعذر تحديد الطلب"
                description="لم نجد رقم الطلب الخاص بعملية OPay الحالية."
            >
                <Link
                    href="/account/orders"
                    className="
                        inline-flex
                        rounded-xl
                        bg-[#1F4E5F]
                        px-6
                        py-3
                        text-sm
                        font-black
                        text-white
                    "
                >
                    عرض طلباتي
                </Link>
            </StateCard>
        );

    }


    if (error) {

        return (
            <StateCard
                icon={
                    XCircle
                }
                iconClass="text-[#C94A45]"
                title="تعذر التحقق من الدفع"
                description={
                    error
                }
            >
                <button
                    type="button"
                    onClick={
                        verifyPayment
                    }
                    className="
                        rounded-xl
                        bg-[#1F4E5F]
                        px-6
                        py-3
                        text-sm
                        font-black
                        text-white
                    "
                >
                    حاول مرة أخرى
                </button>
            </StateCard>
        );

    }


    if (
        result?.paymentStatus ===
        "paid"
    ) {

        return (
            <StateCard
                icon={
                    CheckCircle2
                }
                iconClass="text-[#3F7D58]"
                title="تم الدفع بنجاح 💛"
                description="تم التحقق من عملية OPay وتسجيل دفع طلبك بنجاح."
            >
                <OrderReference
                    orderNumber={
                        orderNumber
                    }
                />

                <div
                    className="
                        flex
                        flex-col
                        justify-center
                        gap-3
                        sm:flex-row
                    "
                >
                    <Link
                        href={
                            `/account/orders/${orderNumber}`
                        }
                        className="
                            rounded-xl
                            bg-[#1F4E5F]
                            px-6
                            py-3
                            text-sm
                            font-black
                            text-white
                        "
                    >
                        متابعة الطلب
                    </Link>

                    <Link
                        href="/products"
                        className="
                            rounded-xl
                            border
                            border-[#D9D0C4]
                            bg-[#FFFEFC]
                            px-6
                            py-3
                            text-sm
                            font-black
                            text-[#56524D]
                        "
                    >
                        متابعة التسوق
                    </Link>
                </div>
            </StateCard>
        );

    }


    if (
        result?.paymentStatus ===
            "failed" ||
        result?.orderStatus ===
            "cancelled"
    ) {

        return (
            <StateCard
                icon={
                    XCircle
                }
                iconClass="text-[#C94A45]"
                title="لم تكتمل عملية الدفع"
                description="لم يتم خصم الطلب كعملية مدفوعة، ويمكنك العودة للسلة والمحاولة من جديد."
            >
                <OrderReference
                    orderNumber={
                        orderNumber
                    }
                />

                <Link
                    href="/checkout"
                    className="
                        inline-flex
                        rounded-xl
                        bg-[#1F4E5F]
                        px-6
                        py-3
                        text-sm
                        font-black
                        text-white
                    "
                >
                    العودة لإتمام الطلب
                </Link>
            </StateCard>
        );

    }


    return (
        <StateCard
            icon={
                Clock3
            }
            iconClass="text-amber-600"
            title="عملية الدفع قيد التحقق"
            description="لم تؤكد OPay العملية نهائيًا بعد. يمكنك إعادة التحقق بعد لحظات."
        >
            <OrderReference
                orderNumber={
                    orderNumber
                }
            />

            <button
                type="button"
                disabled={
                    loading
                }
                onClick={
                    verifyPayment
                }
                className="
                    rounded-xl
                    bg-[#1F4E5F]
                    px-6
                    py-3
                    text-sm
                    font-black
                    text-white
                    disabled:opacity-60
                "
            >
                {
                    loading
                        ? "جاري التحقق..."
                        : "تحقق مرة أخرى"
                }
            </button>
        </StateCard>
    );

}


function StateCard({
    icon: Icon,
    iconClass,
    title,
    description,
    children,
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
                    mx-auto
                    max-w-2xl
                    rounded-3xl
                    border
                    border-[#E7E0D5]
                    bg-[#FFFEFC]
                    px-6
                    py-12
                    text-center
                    shadow-sm
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FAF6EE]
                    "
                >
                    <Icon
                        size={32}
                        className={
                            iconClass
                        }
                    />
                </div>


                <h1
                    className="
                        mt-5
                        text-2xl
                        font-black
                        text-[#252525]
                    "
                >
                    {title}
                </h1>


                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-lg
                        text-sm
                        leading-7
                        text-[#6B6862]
                    "
                >
                    {description}
                </p>


                {
                    children &&
                    (
                        <div
                            className="
                                mt-7
                                space-y-5
                            "
                        >
                            {children}
                        </div>
                    )
                }

            </div>

        </section>

    );

}


function OrderReference({
    orderNumber,
}) {

    return (

        <div
            className="
                mx-auto
                max-w-sm
                rounded-2xl
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
                رقم الطلب
            </div>

            <div
                dir="ltr"
                className="
                    mt-2
                    font-mono
                    text-lg
                    font-black
                    text-[#252525]
                "
            >
                {orderNumber}
            </div>
        </div>

    );

}
