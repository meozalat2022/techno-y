"use client";


import {
    useEffect,
    useMemo,
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
    PackageCheck,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";

import {
    useCart,
} from "@/context/CartContext";

import orderService from
    "@/services/orderService";


const governorates = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "القليوبية",
    "الشرقية",
    "الدقهلية",
    "البحيرة",
    "الغربية",
    "المنوفية",
    "كفر الشيخ",
    "دمياط",
    "بورسعيد",
    "الإسماعيلية",
    "السويس",
    "الفيوم",
    "بني سويف",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "البحر الأحمر",
    "الوادي الجديد",
    "مطروح",
    "شمال سيناء",
    "جنوب سيناء",
];


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


export default function CheckoutPage() {

    const router =
        useRouter();


    const {
        user,
        loading:
            authLoading,
    } =
        useAuth();


    const {
        items,
        subtotal,
        hydrated,
        clearCart,
    } =
        useCart();


    const [
        form,
        setForm,
    ] =
        useState({

            governorate: "",

            city: "",

            address: "",

            landmark: "",

        });


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
        createdOrder,
        setCreatedOrder,
    ] =
        useState(null);


    useEffect(
        () => {

            if (
                authLoading
            ) {
                return;
            }


            if (!user) {

                router.replace(
                    "/account/login?next=/checkout"
                );

            }

        },
        [
            authLoading,
            user,
            router,
        ]
    );


    const cartItems =
        useMemo(
            () =>
                items.map(
                    item => ({

                        product:
                            item.productId,

                        quantity:
                            item.quantity,

                    })
                ),
            [
                items,
            ]
        );


    const updateField =
        (
            field,
            value
        ) => {

            setForm(
                previous => ({
                    ...previous,
                    [field]: value,
                })
            );

        };


    const handleSubmit =
        async event => {

            event.preventDefault();


            if (
                !user ||
                items.length ===
                0
            ) {
                return;
            }


            setSubmitting(true);

            setError("");


            try {

                const response =
                    await orderService
                        .createOrder({

                            customer: {

                                firstName:
                                    user.firstName,

                                lastName:
                                    user.lastName,

                                email:
                                    user.email,

                                phone:
                                    user.phone,

                            },

                            items:
                                cartItems,

                            shippingAddress: {

                                governorate:
                                    form.governorate
                                        .trim(),

                                city:
                                    form.city
                                        .trim(),

                                address:
                                    form.address
                                        .trim(),

                                landmark:
                                    form.landmark
                                        .trim(),

                            },

                            payment: {
                                method: "cod",
                            },

                        });


                setCreatedOrder(
                    response.data
                );


                clearCart();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    "تعذر إنشاء الطلب. حاول مرة أخرى."

                );

            } finally {

                setSubmitting(false);

            }

        };


    if (
        authLoading ||
        !hydrated
    ) {

        return (
            <LoadingState />
        );

    }


    if (!user) {

        return (
            <LoadingState />
        );

    }


    if (
        createdOrder
    ) {

        return (

            <OrderSuccess
                order={
                    createdOrder
                }
            />

        );

    }


    if (
        items.length ===
        0
    ) {

        return (
            <EmptyCheckout />
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

                    <div
                        className="
                            text-sm
                            font-semibold
                            text-[#6B6862]
                        "
                    >
                        إتمام الطلب
                    </div>


                    <h1
                        className="
                            mt-2
                            text-3xl
                            font-black
                            text-[#252525]
                        "
                    >
                        بيانات الشحن والدفع
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-7
                            text-[#6B6862]
                        "
                    >
                        راجع بياناتك وأدخل عنوان
                        الشحن لإتمام الطلب.
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

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[minmax(0,1fr)_380px]
                        lg:items-start
                    "
                >

                    <div
                        className="
                            space-y-6
                        "
                    >

                        <CustomerSection
                            user={user}
                        />


                        <ShippingAddressSection
                            form={form}
                            updateField={
                                updateField
                            }
                        />


                        <PaymentSection />


                        {error && (

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
                                {error}
                            </div>

                        )}

                    </div>


                    <CheckoutSummary
                        items={
                            items
                        }
                        subtotal={
                            subtotal
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


function CustomerSection({
    user,
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

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#F4EDE2]
                        text-[#6B6862]
                    "
                >
                    <CheckCircle2
                        size={19}
                    />
                </div>


                <div>

                    <h2
                        className="
                            font-black
                            text-[#252525]
                        "
                    >
                        بيانات العميل
                    </h2>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-[#6B6862]
                        "
                    >
                        البيانات المسجلة في حسابك
                    </p>

                </div>

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
                    label="الاسم"
                    value={
                        `${user.firstName} ${user.lastName}`
                    }
                />


                <Info
                    label="رقم الهاتف"
                    value={
                        user.phone ||
                        "—"
                    }
                    ltr
                />


                <Info
                    label="البريد الإلكتروني"
                    value={
                        user.email
                    }
                    ltr
                />

            </div>

        </section>

    );

}


function ShippingAddressSection({
    form,
    updateField,
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

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#F4EDE2]
                        text-[#6B6862]
                    "
                >
                    <MapPin
                        size={19}
                    />
                </div>


                <div>

                    <h2
                        className="
                            font-black
                            text-[#252525]
                        "
                    >
                        عنوان الشحن
                    </h2>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-[#6B6862]
                        "
                    >
                        أدخل العنوان الذي سيتم
                        توصيل الطلب إليه
                    </p>

                </div>

            </div>


            <div
                className="
                    mt-6
                    grid
                    gap-5
                    sm:grid-cols-2
                "
            >

                <Field
                    label="المحافظة"
                >

                    <select
                        required
                        value={
                            form.governorate
                        }
                        onChange={
                            event =>
                                updateField(
                                    "governorate",
                                    event.target
                                        .value
                                )
                        }
                        className={
                            inputClass
                        }
                    >

                        <option value="">
                            اختر المحافظة
                        </option>


                        {
                            governorates.map(
                                governorate => (

                                    <option
                                        key={
                                            governorate
                                        }
                                        value={
                                            governorate
                                        }
                                    >
                                        {
                                            governorate
                                        }
                                    </option>

                                )
                            )
                        }

                    </select>

                </Field>


                <Field
                    label="المدينة / المنطقة"
                >

                    <input
                        required
                        value={
                            form.city
                        }
                        onChange={
                            event =>
                                updateField(
                                    "city",
                                    event.target
                                        .value
                                )
                        }
                        placeholder="مثال: مدينة نصر"
                        className={
                            inputClass
                        }
                    />

                </Field>


                <div
                    className="
                        sm:col-span-2
                    "
                >

                    <Field
                        label="العنوان بالتفصيل"
                    >

                        <textarea
                            required
                            rows="3"
                            value={
                                form.address
                            }
                            onChange={
                                event =>
                                    updateField(
                                        "address",
                                        event.target
                                            .value
                                    )
                            }
                            placeholder="اسم الشارع، رقم العقار، الدور، رقم الشقة..."
                            className={
                                inputClass
                            }
                        />

                    </Field>

                </div>


                <div
                    className="
                        sm:col-span-2
                    "
                >

                    <Field
                        label="علامة مميزة"
                        optional
                    >

                        <input
                            value={
                                form.landmark
                            }
                            onChange={
                                event =>
                                    updateField(
                                        "landmark",
                                        event.target
                                            .value
                                    )
                            }
                            placeholder="مثال: بجوار صيدلية..."
                            className={
                                inputClass
                            }
                        />

                    </Field>

                </div>

            </div>

        </section>

    );

}


function PaymentSection() {

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

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#F4EDE2]
                        text-[#6B6862]
                    "
                >
                    <ShieldCheck
                        size={19}
                    />
                </div>


                <div>

                    <h2
                        className="
                            font-black
                            text-[#252525]
                        "
                    >
                        طريقة الدفع
                    </h2>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-[#6B6862]
                        "
                    >
                        طرق الدفع الإلكتروني ستضاف
                        لاحقاً
                    </p>

                </div>

            </div>


            <label
                className="
                    mt-5
                    flex
                    cursor-pointer
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-[#D9D0C4]
                    bg-[#FAF6EE]
                    p-4
                "
            >

                <input
                    type="radio"
                    checked
                    readOnly
                    className="
                        mt-1
                    "
                />


                <div>

                    <div
                        className="
                            text-sm
                            font-black
                            text-[#252525]
                        "
                    >
                        الدفع عند الاستلام
                    </div>


                    <div
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-[#6B6862]
                        "
                    >
                        ادفع قيمة الطلب عند استلامه
                    </div>

                </div>

            </label>

        </section>

    );

}


function CheckoutSummary({
    items,
    subtotal,
    submitting,
}) {

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
                    max-h-[330px]
                    space-y-4
                    overflow-y-auto
                    pl-1
                "
            >

                {
                    items.map(
                        item => (

                            <SummaryItem
                                key={
                                    item.productId
                                }
                                item={
                                    item
                                }
                            />

                        )
                    )
                }

            </div>


            <div
                className="
                    mt-5
                    border-t
                    border-[#E7E0D5]
                    pt-4
                "
            >

                <SummaryRow
                    label="إجمالي المنتجات"
                    value={
                        formatCurrency(
                            subtotal
                        )
                    }
                />


                <SummaryRow
                    label="الشحن"
                    value="سيحدد لاحقاً"
                />


                <div
                    className="
                        mt-3
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
                            الإجمالي الحالي
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
                                    subtotal
                                )
                            }
                        </span>

                    </div>

                </div>

            </div>


            <button
                type="submit"
                disabled={
                    submitting
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
                    disabled:opacity-60
                "
            >

                <PackageCheck
                    size={18}
                />


                {
                    submitting
                        ? "جاري إنشاء الطلب..."
                        : "تأكيد الطلب"
                }

            </button>


            <p
                className="
                    mt-3
                    text-center
                    text-[11px]
                    leading-5
                    text-[#8A857D]
                "
            >
                يتم التحقق من السعر والمخزون مرة
                أخرى على السيرفر قبل إنشاء الطلب.
            </p>

        </aside>

    );

}


function SummaryItem({
    item,
}) {

    const hasSale =
        Number(
            item.salePrice
        ) > 0 &&
        Number(
            item.salePrice
        ) <
        Number(
            item.regularPrice
        );


    const price =
        hasSale
            ? Number(
                item.salePrice
            )
            : Number(
                item.regularPrice
            );


    return (

        <div
            className="
                flex
                gap-3
            "
        >

            <div
                className="
                    flex
                    h-14
                    w-14
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
                                    p-1
                                "
                            />

                        )
                        : (

                            <ShoppingBag
                                size={22}
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
                        line-clamp-2
                        text-xs
                        font-bold
                        leading-5
                        text-[#3C3935]
                    "
                >
                    {item.title}
                </div>


                <div
                    className="
                        mt-1
                        flex
                        items-center
                        justify-between
                        gap-3
                        text-xs
                        text-[#6B6862]
                    "
                >

                    <span>
                        الكمية:
                        {" "}
                        {item.quantity}
                    </span>


                    <span
                        className="
                            font-bold
                            text-[#3C3935]
                        "
                    >
                        {
                            formatCurrency(
                                price *
                                item.quantity
                            )
                        }
                    </span>

                </div>

            </div>

        </div>

    );

}


function OrderSuccess({
    order,
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
                    طلبك وصلنا بنجاح 💛
                </h1>


                <p
                    className="
                        mt-3
                        text-sm
                        leading-7
                        text-[#6B6862]
                    "
                >
                    شكرًا إنك اخترت تكنو-واي…
                    علشان راحة بيتك تهمّنا.
                    تقدر تتابع حالة طلبك من حسابك.
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
                        رقم الطلب
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
                            order.orderNumber
                        }
                    </div>


                    <div
                        className="
                            mt-5
                            text-xs
                            text-[#6B6862]
                        "
                    >
                        إجمالي الطلب
                    </div>


                    <div
                        className="
                            mt-2
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
                        href="/account/orders"
                        className="
                            inline-flex
                            items-center
                            justify-center
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
                        متابعة الطلب

                        <ArrowLeft
                            size={17}
                        />
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

            </div>

        </section>

    );

}


function EmptyCheckout() {

    return (

        <section
            className="
                mx-auto
                max-w-7xl
                px-4
                py-20
                sm:px-6
                lg:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-lg
                    rounded-3xl
                    border
                    border-[#E7E0D5]
                    bg-[#FFFEFC]
                    px-6
                    py-12
                    text-center
                "
            >

                <ShoppingBag
                    size={42}
                    className="
                        mx-auto
                        text-[#B8B0A5]
                    "
                />


                <h1
                    className="
                        mt-4
                        text-2xl
                        font-black
                        text-[#252525]
                    "
                >
                    لا توجد منتجات لإتمام الطلب
                </h1>


                <p
                    className="
                        mt-2
                        text-sm
                        text-[#6B6862]
                    "
                >
                    أضف منتجات إلى السلة أولاً.
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

        </section>

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
                text-sm
                text-[#6B6862]
            "
        >
            جاري تجهيز صفحة إتمام الطلب...
        </div>

    );

}


function Info({
    label,
    value,
    ltr = false,
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
                dir={
                    ltr
                        ? "ltr"
                        : undefined
                }
                className="
                    mt-2
                    break-words
                    text-sm
                    font-bold
                    text-[#252525]
                "
            >
                {value}
            </div>

        </div>

    );

}


function Field({
    label,
    optional = false,
    children,
}) {

    return (

        <label className="block">

            <span
                className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[#56524D]
                "
            >

                {label}

                {
                    optional &&
                    (
                        <span
                            className="
                                mr-1
                                text-xs
                                font-normal
                                text-[#8A857D]
                            "
                        >
                            (اختياري)
                        </span>
                    )
                }

            </span>


            {children}

        </label>

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
                py-2
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
                    text-left
                    font-bold
                    text-[#3C3935]
                "
            >
                {value}
            </span>

        </div>

    );

}


const inputClass = `
    w-full
    rounded-xl
    border
    border-[#D9D0C4]
    bg-[#FFFEFC]
    px-3
    py-3
    text-sm
    text-[#252525]
    outline-none
    transition
    focus:border-[#1F4E5F]
`;