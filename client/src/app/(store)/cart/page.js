"use client";


import Link from "next/link";

import {
    ArrowLeft,
    ImageOff,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import SafeImage from
    "@/components/store/SafeImage";

import {
    useCart,
} from "@/context/CartContext";


import formatCurrency from
    "@/utils/formatCurrency";


export default function CartPage() {

    const {
        items,
        hydrated,
        itemCount,
        subtotal,
        updateQuantity,
        removeItem,
        clearCart,
    } =
        useCart();


    if (!hydrated) {

        return (

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-20
                    text-center
                    text-sm
                    text-[#6B6862]
                    sm:px-6
                    lg:px-8
                "
            >
                جاري تحميل السلة...
            </div>

        );

    }


    if (
        items.length ===
        0
    ) {

        return (
            <EmptyCart />
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
                        متجر تكنو-واي
                    </div>


                    <h1
                        className="
                            mt-2
                            text-3xl
                            font-black
                            text-[#252525]
                        "
                    >
                        سلة التسوق
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-[#6B6862]
                        "
                    >
                        لديك{" "}
                        <strong
                            className="
                                text-[#3C3935]
                            "
                        >
                            {itemCount}
                        </strong>{" "}
                        قطعة في السلة
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

                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[minmax(0,1fr)_360px]
                        lg:items-start
                    "
                >

                    <div>

                        <div
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
                                    justify-between
                                    gap-4
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
                                    المنتجات
                                </h2>


                                <button
                                    type="button"
                                    onClick={
                                        () => {

                                            if (
                                                window.confirm(
                                                    "هل تريد تفريغ سلة التسوق؟"
                                                )
                                            ) {

                                                clearCart();

                                            }

                                        }
                                    }
                                    className="
                                        text-xs
                                        font-bold
                                        text-red-600
                                        hover:text-red-800
                                    "
                                >
                                    تفريغ السلة
                                </button>

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

                                            <CartItem
                                                key={
                                                    item.productId
                                                }
                                                item={
                                                    item
                                                }
                                                updateQuantity={
                                                    updateQuantity
                                                }
                                                removeItem={
                                                    removeItem
                                                }
                                            />

                                        )
                                    )
                                }

                            </div>

                        </div>


                        <Link
                            href="/products"
                            className="
                                mt-5
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-bold
                                text-[#56524D]
                                hover:text-[#252525]
                            "
                        >
                            <ArrowLeft
                                size={16}
                            />

                            متابعة التسوق
                        </Link>

                    </div>


                    <OrderSummary
                        subtotal={
                            subtotal
                        }
                    />

                </div>

            </section>

        </>

    );

}


function CartItem({
    item,
    updateQuantity,
    removeItem,
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


    const lineTotal =
        price *
        item.quantity;


    return (

        <div
            className="
                p-4
                sm:p-5
            "
        >

            <div
                className="
                    flex
                    gap-4
                "
            >

                <Link
                    href={
                        `/products/${item.slug}`
                    }
                    className="
                        flex
                        h-24
                        w-24
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#E7E0D5]
                        bg-[#FAF6EE]
                        sm:h-28
                        sm:w-28
                    "
                >

                    {
                        item.image
                            ?.url
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

                                <ImageOff
                                    size={32}
                                    className="
                                        text-[#B8B0A5]
                                    "
                                />

                            )
                    }

                </Link>


                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >

                        <div>

                            <Link
                                href={
                                    `/products/${item.slug}`
                                }
                                className="
                                    line-clamp-2
                                    text-sm
                                    font-black
                                    leading-6
                                    text-[#252525]
                                    hover:text-[#6B6862]
                                    sm:text-base
                                "
                            >
                                {item.title}
                            </Link>


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

                        </div>


                        <button
                            type="button"
                            onClick={
                                () =>
                                    removeItem(
                                        item.productId
                                    )
                            }
                            aria-label="حذف المنتج"
                            className="
                                shrink-0
                                rounded-lg
                                p-2
                                text-red-500
                                hover:bg-red-50
                            "
                        >
                            <Trash2
                                size={17}
                            />
                        </button>

                    </div>


                    <div
                        className="
                            mt-4
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    text-sm
                                    font-black
                                    text-[#252525]
                                "
                            >
                                {
                                    formatCurrency(
                                        price
                                    )
                                }
                            </div>


                            {
                                hasSale &&
                                (

                                    <div
                                        className="
                                            mt-1
                                            text-xs
                                            text-[#8A857D]
                                            line-through
                                        "
                                    >
                                        {
                                            formatCurrency(
                                                item
                                                    .regularPrice
                                            )
                                        }
                                    </div>

                                )
                            }

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                sm:justify-end
                            "
                        >

                            <QuantityControl
                                item={
                                    item
                                }
                                updateQuantity={
                                    updateQuantity
                                }
                            />


                            <div
                                className="
                                    min-w-[95px]
                                    text-left
                                    text-sm
                                    font-black
                                    text-[#252525]
                                "
                            >
                                {
                                    formatCurrency(
                                        lineTotal
                                    )
                                }
                            </div>

                        </div>

                    </div>


                    {
                        item.stockQuantity <=
                        5 &&
                        (

                            <div
                                className="
                                    mt-3
                                    text-xs
                                    font-semibold
                                    text-amber-700
                                "
                            >
                                المتاح حالياً:{" "}
                                {
                                    item.stockQuantity
                                }
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
            "
        >

            <button
                type="button"
                disabled={
                    item.quantity >=
                    item.stockQuantity
                }
                onClick={
                    () =>
                        updateQuantity(
                            item.productId,
                            item.quantity +
                                1
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
                {item.quantity}
            </div>


            <button
                type="button"
                disabled={
                    item.quantity <=
                    1
                }
                onClick={
                    () =>
                        updateQuantity(
                            item.productId,
                            item.quantity -
                                1
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


function OrderSummary({
    subtotal,
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
                    divide-y
                    divide-[#EFE9E0]
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
                    value="يحدد عند إتمام الطلب"
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
                            font-bold
                            text-[#3C3935]
                        "
                    >
                        الإجمالي الحالي
                    </span>


                    <strong
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
                    </strong>

                </div>

            </div>


            <Link
                href="/checkout"
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
                "
            >

                إتمام الطلب

                <ArrowLeft
                    size={17}
                />

            </Link>


            <p
                className="
                    mt-3
                    text-center
                    text-[11px]
                    leading-5
                    text-[#8A857D]
                "
            >
                الأسعار والمخزون يتم التحقق منهما
                مرة أخرى عند إنشاء الطلب.
            </p>

        </aside>

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
                    font-semibold
                    text-[#3C3935]
                "
            >
                {value}
            </span>

        </div>

    );

}


function EmptyCart() {

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
                    max-w-xl
                    rounded-3xl
                    border
                    border-[#E7E0D5]
                    bg-[#FFFEFC]
                    px-6
                    py-14
                    text-center
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
                        rounded-2xl
                        bg-[#F4EDE2]
                        text-[#6B6862]
                    "
                >
                    <ShoppingBag
                        size={30}
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
                    سلتك لسه فاضية
                </h1>


                <p
                    className="
                        mt-3
                        text-sm
                        leading-7
                        text-[#6B6862]
                    "
                >
                    دور على القطعة اللي محتاجها، ولو مش متأكد من الاختيار إحنا نساعدك.
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