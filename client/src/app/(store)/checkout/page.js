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
    Coins,
    MapPin,
    PackageCheck,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";

import SafeImage from
    "@/components/store/SafeImage";

import {
    useCart,
} from "@/context/CartContext";

import orderService from
    "@/services/orderService";

import loyaltyService from
    "@/services/loyaltyService";

import getApiErrorMessage from
    "@/utils/getApiErrorMessage";


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


import formatCurrency from
    "@/utils/formatCurrency";


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


    const [
        paymentMethod,
        setPaymentMethod,
    ] =
        useState("cod");


    const [loyaltySummary, setLoyaltySummary] = useState(null);
    const [loyaltyLoading, setLoyaltyLoading] = useState(false);
    const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);


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


    useEffect(() => {
        if (!user) return;
        let active = true;
        const loadLoyalty = async () => {
            setLoyaltyLoading(true);
            try {
                const response = await loyaltyService.getMyLoyalty();
                if (active) setLoyaltySummary(response.data);
            } catch {
                // Loyalty must never block normal checkout.
            } finally {
                if (active) setLoyaltyLoading(false);
            }
        };
        loadLoyalty();
        return () => { active = false; };
    }, [user]);


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


    const loyaltyRules = loyaltySummary?.rules;
    const spendablePoints = Math.max(Number(loyaltySummary?.spendablePoints || 0), 0);
    const pointsPerEgp = Number(loyaltyRules?.pointsPerRedemptionEgp || 10);
    const redemptionStep = Number(loyaltyRules?.redemptionStepPoints || 10);
    const minimumRedemption = Number(loyaltyRules?.minimumRedemptionPoints || 100);
    const maxPointsByOrder = Math.max(Math.floor((Math.max(Number(subtotal)-1,0)*pointsPerEgp)/redemptionStep)*redemptionStep,0);
    const maxRedeemablePoints = Math.min(spendablePoints, maxPointsByOrder);
    const safeRedeemedPoints = Math.min(Math.max(Number(loyaltyPointsToRedeem)||0,0), maxRedeemablePoints);
    const loyaltyDiscount = safeRedeemedPoints / pointsPerEgp;
    const checkoutTotal = Math.max(Number(subtotal)-loyaltyDiscount,0);


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


            setError("");


            if (
                !form.governorate
                    .trim()
            ) {

                setError(
                    "من فضلك اختر محافظة الشحن."
                );

                return;

            }


            if (
                !form.city
                    .trim()
            ) {

                setError(
                    "من فضلك أدخل المدينة أو المنطقة."
                );

                return;

            }


            if (
                !form.address
                    .trim()
            ) {

                setError(
                    "من فضلك أدخل عنوان الشحن بالتفصيل."
                );

                return;

            }


            if (safeRedeemedPoints > 0 && safeRedeemedPoints < minimumRedemption) {
                setError(`الحد الأدنى لاستخدام النقاط هو ${minimumRedemption} نقطة.`);
                return;
            }


            setSubmitting(true);


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
                                method:
                                    paymentMethod,
                            },

                            loyaltyPointsToRedeem:
                                safeRedeemedPoints,

                        });


                const order =
                    response.data;


                if (
                    paymentMethod ===
                    "cod"
                ) {

                    setCreatedOrder(
                        order
                    );


                    clearCart();


                    return;

                }


                /*
                 * Keep the cart intact while the
                 * customer is away on OPay.
                 * It is cleared only after our
                 * backend verifies SUCCESS.
                 */
                window.sessionStorage
                    .setItem(
                        "technoy-opay-pending-order",
                        order.orderNumber
                    );


                const paymentResponse =
                    await orderService
                        .createOpayPayment(
                            order.orderNumber
                        );


                const cashierUrl =
                    paymentResponse.data
                        ?.cashierUrl;


                if (!cashierUrl) {

                    throw new Error(
                        "لم يتم استلام رابط الدفع من OPay."
                    );

                }


                window.location.assign(
                    cashierUrl
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    error.message ||
                    (
                        paymentMethod ===
                        "opay"
                            ? "تعذر بدء الدفع الإلكتروني. حاول مرة أخرى."
                            : "تعذر إنشاء الطلب. حاول مرة أخرى."
                    )

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
                            leading-6
                            text-red-700
                        "
                    >
                        {error}
                    </div>

                )}


                <form
                    noValidate
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


                        <LoyaltySection
                            summary={loyaltySummary}
                            loading={loyaltyLoading}
                            points={safeRedeemedPoints}
                            setPoints={setLoyaltyPointsToRedeem}
                            maxPoints={maxRedeemablePoints}
                            minimumRedemption={minimumRedemption}
                            redemptionStep={redemptionStep}
                            pointsPerEgp={pointsPerEgp}
                        />


                        <PaymentSection
                            paymentMethod={
                                paymentMethod
                            }
                            setPaymentMethod={
                                setPaymentMethod
                            }
                        />


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
                        paymentMethod={
                            paymentMethod
                        }
                        loyaltyPoints={safeRedeemedPoints}
                        loyaltyDiscount={loyaltyDiscount}
                        checkoutTotal={checkoutTotal}
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


function LoyaltySection({ summary, loading, points, setPoints, maxPoints, minimumRedemption, redemptionStep, pointsPerEgp }) {
    const spendable = Math.max(Number(summary?.spendablePoints || 0), 0);
    if (loading) return <section className="rounded-2xl border border-[#E7E0D5] bg-[#FFFEFC] p-5 sm:p-6"><div className="text-sm text-[#6B6862]">جاري تحميل نقاط الولاء...</div></section>;
    if (!summary) return null;
    const canRedeem = maxPoints >= minimumRedemption;
    const discount = points / pointsPerEgp;
    return <section className="rounded-2xl border border-[#E7E0D5] bg-[#FFFEFC] p-5 sm:p-6">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5B82E]/20 text-[#8A6400]"><Coins size={19}/></div><div><h2 className="font-black text-[#252525]">نقاط الولاء</h2><p className="mt-1 text-xs text-[#6B6862]">لديك {spendable} نقطة متاحة للاستخدام.</p></div></div>
        <div className="mt-5 rounded-xl bg-[#FAF6EE] p-4"><div className="flex items-center justify-between gap-4 text-sm"><span className="text-[#6B6862]">قيمة الرصيد المتاح</span><strong className="text-[#252525]">{formatCurrency(summary.availableCreditEgp)}</strong></div><div className="mt-2 text-xs leading-6 text-[#8A857D]">{summary.rules?.pointsPerRedemptionEgp} نقاط = 1 جنيه خصم. الحد الأدنى للاستخدام {minimumRedemption} نقطة.</div></div>
        {canRedeem ? <>
            <label className="mt-5 block"><span className="mb-2 block text-sm font-bold text-[#56524D]">عدد النقاط المستخدمة</span><input type="range" min="0" max={maxPoints} step={redemptionStep} value={points} onChange={e=>setPoints(Number(e.target.value))} className="w-full accent-[#1F4E5F]"/></label>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div className="text-sm text-[#6B6862]">ستستخدم <strong className="text-[#252525]">{points} نقطة</strong></div><div className="text-sm font-black text-[#3F7D58]">خصم {formatCurrency(discount)}</div></div>
            <div className="mt-3 flex gap-2"><button type="button" onClick={()=>setPoints(0)} className="rounded-lg border border-[#D9D0C4] px-3 py-2 text-xs font-bold">بدون نقاط</button><button type="button" onClick={()=>setPoints(maxPoints)} className="rounded-lg bg-[#1F4E5F] px-3 py-2 text-xs font-bold text-white">استخدام أقصى رصيد</button></div>
        </> : <p className="mt-4 text-xs leading-6 text-[#8A857D]">تحتاج إلى {minimumRedemption} نقطة على الأقل، وبما يتناسب مع قيمة الطلب، حتى تتمكن من استخدام النقاط.</p>}
    </section>;
}


function PaymentSection({
    paymentMethod,
    setPaymentMethod,
}) {

    const options = [
        {
            value: "cod",
            title:
                "الدفع عند الاستلام",
            description:
                "ادفع قيمة الطلب عند استلامه.",
        },
        {
            value: "opay",
            title:
                "الدفع الإلكتروني عبر OPay",
            description:
                "سيتم تحويلك إلى صفحة OPay الآمنة لإتمام الدفع، ثم نتحقق من العملية قبل تأكيد الدفع.",
        },
    ];


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
                        اختر الطريقة المناسبة لإتمام طلبك.
                    </p>

                </div>

            </div>


            <div
                className="
                    mt-5
                    space-y-3
                "
            >

                {
                    options.map(
                        option => {

                            const selected =
                                paymentMethod ===
                                option.value;


                            return (

                                <label
                                    key={
                                        option.value
                                    }
                                    className={`
                                        flex
                                        cursor-pointer
                                        items-start
                                        gap-3
                                        rounded-xl
                                        border
                                        p-4
                                        transition
                                        ${
                                            selected
                                                ? "border-[#1F4E5F] bg-[#F3F7F8]"
                                                : "border-[#D9D0C4] bg-[#FFFEFC] hover:bg-[#FAF6EE]"
                                        }
                                    `}
                                >

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={
                                            option.value
                                        }
                                        checked={
                                            selected
                                        }
                                        onChange={
                                            () =>
                                                setPaymentMethod(
                                                    option.value
                                                )
                                        }
                                        className="
                                            mt-1
                                            accent-[#1F4E5F]
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
                                            {
                                                option.title
                                            }
                                        </div>


                                        <div
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[#6B6862]
                                            "
                                        >
                                            {
                                                option.description
                                            }
                                        </div>

                                    </div>

                                </label>

                            );

                        }
                    )
                }

            </div>


            {
                paymentMethod ===
                "opay" &&
                (
                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-[#E7E0D5]
                            bg-[#FAF6EE]
                            px-4
                            py-3
                            text-xs
                            leading-6
                            text-[#6B6862]
                        "
                    >
                        لن نعتبر الطلب مدفوعًا بمجرد
                        الرجوع من صفحة الدفع. يتم
                        التحقق من حالة العملية مع OPay
                        أولًا لحماية طلبك.
                    </div>
                )
            }

        </section>

    );

}


function CheckoutSummary({
    items,
    subtotal,
    submitting,
    paymentMethod,
    loyaltyPoints,
    loyaltyDiscount,
    checkoutTotal,
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


                {loyaltyPoints > 0 && (
                    <SummaryRow
                        label={`خصم النقاط (${loyaltyPoints} نقطة)`}
                        value={`- ${formatCurrency(loyaltyDiscount)}`}
                    />
                )}


                <SummaryRow
                    label="طريقة الدفع"
                    value={
                        paymentMethod ===
                        "opay"
                            ? "OPay"
                            : "الدفع عند الاستلام"
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
                                    checkoutTotal
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
                        ? (
                            paymentMethod ===
                            "opay"
                                ? "جاري تحويلك إلى OPay..."
                                : "جاري إنشاء الطلب..."
                        )
                        : (
                            paymentMethod ===
                            "opay"
                                ? "الدفع الآن عبر OPay"
                                : "تأكيد الطلب"
                        )
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