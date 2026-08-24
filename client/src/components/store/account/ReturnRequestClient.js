"use client";


import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import {
    useRouter,
} from "next/navigation";

import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ImageOff,
    Package,
    RefreshCw,
    RotateCcw,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";

import orderService from
    "@/services/orderService";

import customerReturnService from
    "@/services/customerReturnService";


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


export default function ReturnRequestClient({
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
        selections,
        setSelections,
    ] =
        useState({});


    const [
        reason,
        setReason,
    ] =
        useState("");


    const [
        notes,
        setNotes,
    ] =
        useState("");


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        submitting,
        setSubmitting,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState("");


    const [
        validationError,
        setValidationError,
    ] =
        useState("");


    const [
        createdReturn,
        setCreatedReturn,
    ] =
        useState(null);


    useEffect(
        () => {

            if (authLoading) {
                return;
            }


            if (!user) {

                router.replace(
                    `/account/login?next=/account/orders/${encodeURIComponent(
                        orderNumber
                    )}/return`
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


                    const loadedOrder =
                        response.data;


                    setOrder(
                        loadedOrder
                    );


                    const initialSelections =
                        {};


                    (
                        loadedOrder.items ||
                        []
                    ).forEach(
                        item => {

                            initialSelections[
                                item.product
                            ] = {

                                selected:
                                    false,

                                quantity:
                                    1,

                            };

                        }
                    );


                    setSelections(
                        initialSelections
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        "تعذر تحميل بيانات الطلب."

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                user,
                orderNumber,
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


    const selectedItems =
        useMemo(
            () => {

                if (!order) {
                    return [];
                }


                return order.items
                    .filter(
                        item =>
                            selections[
                                item.product
                            ]?.selected
                    )
                    .map(
                        item => ({

                            product:
                                item.product,

                            quantity:
                                selections[
                                    item.product
                                ].quantity,

                        })
                    );

            },
            [
                order,
                selections,
            ]
        );


    const selectedTotal =
        useMemo(
            () => {

                if (!order) {
                    return 0;
                }


                return order.items.reduce(
                    (
                        total,
                        item
                    ) => {

                        const selection =
                            selections[
                                item.product
                            ];


                        if (
                            !selection
                                ?.selected
                        ) {
                            return total;
                        }


                        return (
                            total +
                            Number(
                                item.pricing
                                    ?.finalPrice ||
                                0
                            ) *
                            selection.quantity
                        );

                    },
                    0
                );

            },
            [
                order,
                selections,
            ]
        );


    const toggleItem =
        productId => {

            setValidationError("");


            setSelections(
                previous => ({

                    ...previous,

                    [productId]: {

                        ...previous[
                            productId
                        ],

                        selected:
                            !previous[
                                productId
                            ]?.selected,

                        quantity:
                            previous[
                                productId
                            ]?.quantity ||
                            1,

                    },

                })
            );

        };


    const updateQuantity = (
        item,
        quantity
    ) => {

        const safeQuantity =
            Math.max(
                1,
                Math.min(
                    Number(quantity) ||
                        1,
                    item.quantity
                )
            );


        setSelections(
            previous => ({

                ...previous,

                [item.product]: {

                    ...previous[
                        item.product
                    ],

                    quantity:
                        safeQuantity,

                },

            })
        );

    };


    const handleSubmit =
        async event => {

            event.preventDefault();


            setError("");

            setValidationError("");


            if (
                order.status !==
                "delivered"
            ) {

                setValidationError(
                    "يمكن طلب إرجاع المنتجات بعد تسليم الطلب فقط."
                );

                return;

            }


            if (
                selectedItems.length ===
                0
            ) {

                setValidationError(
                    "اختر منتجاً واحداً على الأقل للإرجاع."
                );

                return;

            }


            if (!reason.trim()) {

                setValidationError(
                    "يرجى كتابة سبب الإرجاع."
                );

                return;

            }


            setSubmitting(true);


            try {

                const response =
                    await customerReturnService
                        .createCustomerReturn({

                            orderNumber:
                                order.orderNumber,

                            items:
                                selectedItems,

                            reason:
                                reason.trim(),

                            notes:
                                notes.trim(),

                        });


                setCreatedReturn(
                    response.data
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    "تعذر إرسال طلب الإرجاع."

                );

            } finally {

                setSubmitting(false);

            }

        };


    if (
        authLoading ||
        !user ||
        loading
    ) {

        return (
            <LoadingState />
        );

    }


    if (
        error &&
        !order
    ) {

        return (

            <ErrorState
                message={error}
                onRetry={
                    loadOrder
                }
            />

        );

    }


    if (!order) {

        return (

            <ErrorState
                message="الطلب غير موجود."
                onRetry={
                    loadOrder
                }
            />

        );

    }


    if (createdReturn) {

        return (

            <ReturnSuccess
                customerReturn={
                    createdReturn
                }
            />

        );

    }


    if (
        order.status !==
        "delivered"
    ) {

        return (

            <NotDeliveredState
                orderNumber={
                    order.orderNumber
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
                        href={
                            `/account/orders/${order.orderNumber}`
                        }
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

                        العودة إلى الطلب
                    </Link>


                    <div
                        className="
                            mt-5
                        "
                    >

                        <div
                            className="
                                text-sm
                                font-semibold
                                text-[#6B6862]
                            "
                        >
                            طلب إرجاع
                        </div>


                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-black
                                text-[#252525]
                            "
                        >
                            اختر المنتجات المراد إرجاعها
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-7
                                text-[#6B6862]
                            "
                        >
                            الطلب{" "}

                            <span
                                dir="ltr"
                                className="
                                    font-mono
                                    font-bold
                                    text-[#56524D]
                                "
                            >
                                {
                                    order.orderNumber
                                }
                            </span>

                        </p>

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

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[minmax(0,1fr)_340px]
                        lg:items-start
                    "
                >

                    <div
                        className="
                            space-y-6
                        "
                    >

                        <ReturnItems
                            items={
                                order.items ||
                                []
                            }
                            selections={
                                selections
                            }
                            toggleItem={
                                toggleItem
                            }
                            updateQuantity={
                                updateQuantity
                            }
                        />


                        <ReturnReason
                            reason={
                                reason
                            }
                            setReason={
                                setReason
                            }
                            notes={
                                notes
                            }
                            setNotes={
                                setNotes
                            }
                        />


                        {
                            validationError &&
                            (

                                <MessageBox
                                    message={
                                        validationError
                                    }
                                />

                            )
                        }


                        {
                            error &&
                            (

                                <MessageBox
                                    message={
                                        error
                                    }
                                />

                            )
                        }

                    </div>


                    <ReturnSummary
                        selectedItems={
                            selectedItems
                        }
                        selectedTotal={
                            selectedTotal
                        }
                        submitting={
                            submitting
                        }
                    />

                </form>

            </section>

        </>

    );

}


function ReturnItems({
    items,
    selections,
    toggleItem,
    updateQuantity,
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
                    border-b
                    border-[#E7E0D5]
                    px-5
                    py-4
                "
            >

                <h2
                    className="
                        font-black
                        text-[#252525]
                    "
                >
                    منتجات الطلب
                </h2>


                <p
                    className="
                        mt-1
                        text-xs
                        text-[#6B6862]
                    "
                >
                    حدد المنتجات والكميات التي
                    تريد إرجاعها.
                </p>

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

                            <ReturnItem
                                key={
                                    item.product
                                }
                                item={item}
                                selection={
                                    selections[
                                        item.product
                                    ]
                                }
                                toggleItem={
                                    toggleItem
                                }
                                updateQuantity={
                                    updateQuantity
                                }
                            />

                        )
                    )
                }

            </div>

        </section>

    );

}


function ReturnItem({
    item,
    selection,
    toggleItem,
    updateQuantity,
}) {

    const selected =
        Boolean(
            selection?.selected
        );


    const quantity =
        selection?.quantity ||
        1;


    const unitPrice =
        Number(
            item.pricing
                ?.finalPrice
        ) || 0;


    return (

        <div
            className={`
                p-4
                transition
                sm:p-5
                ${
                    selected
                        ? "bg-[#FAF6EE]"
                        : "bg-[#FFFEFC]"
                }
            `}
        >

            <div
                className="
                    flex
                    items-start
                    gap-4
                "
            >

                <input
                    type="checkbox"
                    checked={
                        selected
                    }
                    onChange={
                        () =>
                            toggleItem(
                                item.product
                            )
                    }
                    className="
                        mt-8
                        h-4
                        w-4
                        shrink-0
                    "
                />


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
                        bg-[#FFFEFC]
                    "
                >

                    {
                        item.image?.url
                            ? (

                                <img
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

                                <ImageOff
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
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-4
                            text-xs
                            text-[#6B6862]
                        "
                    >

                        <span>
                            الكمية في الطلب:{" "}

                            <strong
                                className="
                                    text-[#3C3935]
                                "
                            >
                                {
                                    item.quantity
                                }
                            </strong>
                        </span>


                        <span>
                            سعر الوحدة:{" "}

                            <strong
                                className="
                                    text-[#3C3935]
                                "
                            >
                                {
                                    formatCurrency(
                                        unitPrice
                                    )
                                }
                            </strong>
                        </span>

                    </div>


                    {
                        selected &&
                        (

                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        text-xs
                                        font-bold
                                        text-[#6B6862]
                                    "
                                >
                                    كمية الإرجاع
                                </span>


                                <QuantityControl
                                    item={
                                        item
                                    }
                                    quantity={
                                        quantity
                                    }
                                    updateQuantity={
                                        updateQuantity
                                    }
                                />

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    );

}


function QuantityControl({
    item,
    quantity,
    updateQuantity,
}) {

    return (

        <div
            className="
                flex
                h-10
                items-center
                overflow-hidden
                rounded-xl
                border
                border-[#D9D0C4]
                bg-[#FFFEFC]
            "
        >

            <button
                type="button"
                disabled={
                    quantity >=
                    item.quantity
                }
                onClick={
                    () =>
                        updateQuantity(
                            item,
                            quantity + 1
                        )
                }
                className="
                    h-full
                    w-10
                    font-bold
                    hover:bg-[#FAF6EE]
                    disabled:opacity-30
                "
            >
                +
            </button>


            <div
                className="
                    flex
                    h-full
                    min-w-11
                    items-center
                    justify-center
                    border-x
                    border-[#E7E0D5]
                    px-2
                    text-sm
                    font-black
                "
            >
                {quantity}
            </div>


            <button
                type="button"
                disabled={
                    quantity <= 1
                }
                onClick={
                    () =>
                        updateQuantity(
                            item,
                            quantity - 1
                        )
                }
                className="
                    h-full
                    w-10
                    font-bold
                    hover:bg-[#FAF6EE]
                    disabled:opacity-30
                "
            >
                −
            </button>

        </div>

    );

}


function ReturnReason({
    reason,
    setReason,
    notes,
    setNotes,
}) {

    return (

        <section
            className="
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FFFEFC]
                p-5
                sm:p-6
            "
        >

            <h2
                className="
                    font-black
                    text-[#252525]
                "
            >
                سبب الإرجاع
            </h2>


            <p
                className="
                    mt-1
                    text-xs
                    leading-6
                    text-[#6B6862]
                "
            >
                اكتب سبب الإرجاع بشكل واضح حتى
                يتمكن فريقنا من مراجعة الطلب.
            </p>


            <label
                className="
                    mt-5
                    block
                "
            >

                <span
                    className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-[#56524D]
                    "
                >
                    سبب الإرجاع
                </span>


                <textarea
                    required
                    rows="4"
                    value={reason}
                    onChange={
                        event =>
                            setReason(
                                event.target
                                    .value
                            )
                    }
                    placeholder="مثال: القطعة غير متوافقة مع موديل الجهاز..."
                    className="
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-[#D9D0C4]
                        bg-[#FFFEFC]
                        px-4
                        py-3
                        text-sm
                        leading-7
                        outline-none
                        transition
                        focus:border-[#1F4E5F]
                    "
                />

            </label>


            <label
                className="
                    mt-5
                    block
                "
            >

                <span
                    className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-[#56524D]
                    "
                >
                    ملاحظات إضافية{" "}

                    <span
                        className="
                            font-normal
                            text-[#8A857D]
                        "
                    >
                        (اختياري)
                    </span>
                </span>


                <textarea
                    rows="3"
                    value={notes}
                    onChange={
                        event =>
                            setNotes(
                                event.target
                                    .value
                            )
                    }
                    placeholder="أي معلومات إضافية تساعدنا في مراجعة طلب الإرجاع..."
                    className="
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-[#D9D0C4]
                        bg-[#FFFEFC]
                        px-4
                        py-3
                        text-sm
                        leading-7
                        outline-none
                        transition
                        focus:border-[#1F4E5F]
                    "
                />

            </label>

        </section>

    );

}


function ReturnSummary({
    selectedItems,
    selectedTotal,
    submitting,
}) {

    const totalQuantity =
        selectedItems.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
        );


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

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <RotateCcw
                    size={20}
                    className="
                        text-[#6B6862]
                    "
                />


                <h2
                    className="
                        text-lg
                        font-black
                        text-[#252525]
                    "
                >
                    ملخص الإرجاع
                </h2>

            </div>


            <div
                className="
                    mt-5
                    divide-y
                    divide-[#EFE9E0]
                "
            >

                <SummaryRow
                    label="عدد المنتجات"
                    value={
                        selectedItems.length
                    }
                />


                <SummaryRow
                    label="إجمالي القطع"
                    value={
                        totalQuantity
                    }
                />


                <SummaryRow
                    label="قيمة المنتجات المحددة"
                    value={
                        formatCurrency(
                            selectedTotal
                        )
                    }
                />

            </div>


            <div
                className="
                    mt-5
                    rounded-xl
                    bg-amber-50
                    p-4
                "
            >

                <div
                    className="
                        flex
                        gap-3
                    "
                >

                    <AlertCircle
                        size={18}
                        className="
                            mt-0.5
                            shrink-0
                            text-amber-700
                        "
                    />


                    <p
                        className="
                            text-xs
                            leading-6
                            text-amber-800
                        "
                    >
                        إرسال الطلب لا يعيد
                        المنتجات إلى المخزون
                        مباشرة. سيتم مراجعة طلب
                        الإرجاع أولاً.
                    </p>

                </div>

            </div>


            <button
                type="submit"
                disabled={
                    submitting ||
                    selectedItems.length ===
                        0
                }
                className="
                    mt-6
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#1F4E5F]
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-[#173C49]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >

                <RotateCcw
                    size={17}
                />


                {
                    submitting
                        ? "جاري إرسال الطلب..."
                        : "إرسال طلب الإرجاع"
                }

            </button>

        </aside>

    );

}


function ReturnSuccess({
    customerReturn,
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
                    border-emerald-200
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
                        bg-emerald-100
                        text-emerald-700
                    "
                >
                    <CheckCircle2
                        size={32}
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
                    طلب الإرجاع وصلنا بنجاح
                </h1>


                <p
                    className="
                        mt-3
                        text-sm
                        leading-7
                        text-[#6B6862]
                    "
                >
                    استلمنا طلب الإرجاع، وفريق تكنو-واي هيراجعه ويتابع الإجراء معاك.
                </p>


                <div
                    className="
                        mx-auto
                        mt-6
                        max-w-sm
                        rounded-2xl
                        bg-[#FAF6EE]
                        p-5
                    "
                >

                    <div
                        className="
                            text-xs
                            text-[#6B6862]
                        "
                    >
                        رقم طلب الإرجاع
                    </div>


                    <div
                        dir="ltr"
                        className="
                            mt-2
                            font-mono
                            text-xl
                            font-black
                            text-[#252525]
                        "
                    >
                        {
                            customerReturn
                                .returnNumber
                        }
                    </div>


                    <div
                        className="
                            mt-5
                            text-xs
                            text-[#6B6862]
                        "
                    >
                        الحالة
                    </div>


                    <div
                        className="
                            mt-2
                            inline-flex
                            rounded-full
                            bg-amber-50
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-amber-700
                        "
                    >
                        قيد المراجعة
                    </div>

                </div>


                <div
                    className="
                        mt-7
                        flex
                        flex-col
                        justify-center
                        gap-3
                        sm:flex-row
                    "
                >

                    <Link
                        href={
                            `/account/orders/${customerReturn.orderNumber}`
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
                        العودة إلى الطلب
                    </Link>


                    <Link
                        href="/account/orders"
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
                        طلباتي
                    </Link>

                </div>

            </div>

        </section>

    );

}


function NotDeliveredState({
    orderNumber,
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
                    max-w-xl
                    rounded-3xl
                    border
                    border-amber-200
                    bg-amber-50
                    px-6
                    py-12
                    text-center
                "
            >

                <AlertCircle
                    size={40}
                    className="
                        mx-auto
                        text-amber-600
                    "
                />


                <h1
                    className="
                        mt-4
                        text-xl
                        font-black
                        text-[#252525]
                    "
                >
                    الإرجاع غير متاح لهذا الطلب
                </h1>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-7
                        text-[#6B6862]
                    "
                >
                    يمكن إنشاء طلب إرجاع بعد
                    وصول الطلب إلى حالة تم
                    التسليم.
                </p>


                <Link
                    href={
                        `/account/orders/${orderNumber}`
                    }
                    className="
                        mt-6
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
                    العودة إلى الطلب
                </Link>

            </div>

        </section>

    );

}


function MessageBox({
    message,
}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-5
                py-4
                text-sm
                leading-6
                text-red-700
            "
        >
            {message}
        </div>

    );

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
                    font-black
                    text-[#252525]
                "
            >
                {value}
            </span>

        </div>

    );

}


function LoadingState() {

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
                    جاري تجهيز طلب الإرجاع...
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

                <Package
                    size={38}
                    className="
                        mx-auto
                        text-red-400
                    "
                />


                <div
                    className="
                        mt-4
                        text-lg
                        font-black
                        text-red-800
                    "
                >
                    تعذر إنشاء طلب الإرجاع
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


                <button
                    type="button"
                    onClick={
                        onRetry
                    }
                    className="
                        mt-5
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

            </div>

        </section>

    );

}