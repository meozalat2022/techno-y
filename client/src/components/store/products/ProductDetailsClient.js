"use client";


import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import {
    ArrowLeft,
    Boxes,
    CheckCircle2,
    ChevronLeft,
    PackageCheck,
    MessageCircle,
    RefreshCw,
    ShieldCheck,
    ShoppingCart,
    Tag,
    Truck,
    Wrench,
    XCircle,
} from "lucide-react";

import productService from
    "@/services/productService";

import ProductGallery from
    "@/components/store/products/ProductGallery";

import ProductCard from
    "@/components/store/ProductCard";
import {
    useCart,
} from "@/context/CartContext";

import formatCurrency from
    "@/utils/formatCurrency";


export default function ProductDetailsClient({
    slug,
}) {

    const {
        addItem,
    } =
        useCart();


    const [
        cartMessage,
        setCartMessage,
    ] =
        useState("");


    const [
        cartMessageType,
        setCartMessageType,
    ] =
        useState("success");

    const [
        product,
        setProduct,
    ] =
        useState(null);


    const [
        relatedProducts,
        setRelatedProducts,
    ] =
        useState([]);


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        relatedLoading,
        setRelatedLoading,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState("");


    const [
        quantity,
        setQuantity,
    ] =
        useState(1);


    const loadProduct =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await productService
                            .getProductBySlug(
                                slug
                            );


                    const loadedProduct =
                        response.data;


                    setProduct(
                        loadedProduct
                    );


                    setQuantity(1);


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        "تعذر تحميل بيانات المنتج."

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                slug,
            ]
        );


    useEffect(
        () => {

            loadProduct();

        },
        [
            loadProduct,
        ]
    );


    useEffect(
        () => {

            if (
                !product?.category?._id
            ) {
                return;
            }


            const loadRelated =
                async () => {

                    setRelatedLoading(
                        true
                    );


                    try {

                        const response =
                            await productService
                                .getProducts({

                                    page: 1,

                                    limit: 8,

                                    category:
                                        product
                                            .category
                                            ._id,

                                    sort:
                                        "newest",

                                });


                        const filtered =
                            (
                                response.data ||
                                []
                            )
                                .filter(
                                    item =>
                                        item._id !==
                                        product._id
                                )
                                .slice(
                                    0,
                                    4
                                );


                        setRelatedProducts(
                            filtered
                        );


                    } catch {

                        setRelatedProducts(
                            []
                        );

                    } finally {

                        setRelatedLoading(
                            false
                        );

                    }

                };


            loadRelated();

        },
        [
            product,
        ]
    );


    const hasSale =
        useMemo(
            () => {

                if (!product) {
                    return false;
                }


                return (
                    Number(
                        product.salePrice
                    ) > 0 &&
                    Number(
                        product.salePrice
                    ) <
                    Number(
                        product.regularPrice
                    )
                );

            },
            [
                product,
            ]
        );


    const currentPrice =
        hasSale
            ? product?.salePrice
            : product?.regularPrice;


    const outOfStock =
        !product ||
        product.stockQuantity <=
        0 ||
        product.stockStatus ===
        "out-of-stock";


    const lowStock =
        product &&
        !outOfStock &&
        product.stockQuantity <=
        product.lowStockThreshold;


    const maxQuantity =
        product
            ? Math.max(
                product.stockQuantity,
                1
            )
            : 1;


    const decreaseQuantity =
        () => {

            setQuantity(
                previous =>
                    Math.max(
                        1,
                        previous - 1
                    )
            );

        };


    const increaseQuantity =
        () => {

            if (outOfStock) {
                return;
            }


            setQuantity(
                previous =>
                    Math.min(
                        maxQuantity,
                        previous + 1
                    )
            );

        };


    if (loading) {

        return (
            <LoadingState />
        );

    }


    if (
        error ||
        !product
    ) {

        return (
            <ErrorState
                message={
                    error ||
                    "المنتج غير موجود."
                }
                onRetry={
                    loadProduct
                }
            />
        );

    }
    const handleAddToCart =
        () => {

            if (
                !product ||
                outOfStock
            ) {
                return;
            }


            const result =
                addItem(
                    product,
                    quantity
                );


            setCartMessage(
                result.message
            );


            setCartMessageType(
                result.success
                    ? "success"
                    : "error"
            );


            if (result.success) {

                setQuantity(1);

            }


            window.setTimeout(
                () => {

                    setCartMessage("");

                },
                3000
            );

        };

    return (

        <>

            <div
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
                        py-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                            text-xs
                            text-[#6B6862]
                        "
                    >

                        <Link
                            href="/"
                            className="
                                hover:text-[#1F4E5F]
                            "
                        >
                            الرئيسية
                        </Link>


                        <ChevronLeft
                            size={14}
                        />


                        <Link
                            href="/products"
                            className="
                                hover:text-[#1F4E5F]
                            "
                        >
                            المنتجات
                        </Link>


                        {
                            product.category
                                ?.name &&
                            (
                                <>
                                    <ChevronLeft
                                        size={14}
                                    />

                                    <Link
                                        href={
                                            `/products?category=${product.category._id}`
                                        }
                                        className="
                                            hover:text-[#1F4E5F]
                                        "
                                    >
                                        {
                                            product
                                                .category
                                                .name
                                        }
                                    </Link>
                                </>
                            )
                        }


                        <ChevronLeft
                            size={14}
                        />


                        <span
                            className="
                                max-w-[250px]
                                truncate
                                text-[#4D4A45]
                            "
                        >
                            {product.title}
                        </span>

                    </div>

                </div>

            </div>


            <section
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                    lg:py-12
                "
            >

                <div
                    className="
                        grid
                        gap-10
                        lg:grid-cols-2
                        lg:items-start
                    "
                >

                    <ProductGallery
                        images={
                            product.images ||
                            []
                        }
                        title={
                            product.title
                        }
                    />


                    <div>

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >

                            {
                                product.category
                                    ?.name &&
                                (

                                    <Link
                                        href={
                                            `/products?category=${product.category._id}`
                                        }
                                        className="
                                            rounded-full
                                            bg-[#F4EEE4]
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-bold
                                            text-[#6B6862]
                                            hover:bg-[#EFE6D8]
                                        "
                                    >
                                        {
                                            product
                                                .category
                                                .name
                                        }
                                    </Link>

                                )
                            }


                            {
                                product.brand
                                    ?.name &&
                                (

                                    <Link
                                        href={
                                            `/products?brand=${product.brand._id}`
                                        }
                                        className="
                                            rounded-full
                                            bg-[#F4EEE4]
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-bold
                                            text-[#6B6862]
                                            hover:bg-[#EFE6D8]
                                        "
                                    >
                                        {
                                            product
                                                .brand
                                                .name
                                        }
                                    </Link>

                                )
                            }


                            {
                                product.featured &&
                                (

                                    <span
                                        className="
                                            rounded-full
                                            bg-[#FFF6DA]
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-bold
                                            text-[#9A6B00]
                                        "
                                    >
                                        منتج مميز
                                    </span>

                                )
                            }

                        </div>


                        <h1
                            className="
                                mt-5
                                text-2xl
                                font-black
                                leading-[1.55]
                                text-[#252525]
                                sm:text-3xl
                                lg:text-4xl
                            "
                        >
                            {product.title}
                        </h1>


                        <div
                            className="
                                mt-3
                                flex
                                flex-wrap
                                items-center
                                gap-4
                                text-sm
                                text-[#6B6862]
                            "
                        >

                            <span>
                                SKU:
                                {" "}
                                <span
                                    dir="ltr"
                                    className="
                                        font-mono
                                        font-semibold
                                        text-[#4D4A45]
                                    "
                                >
                                    {product.sku}
                                </span>
                            </span>


                            <StockStatus
                                outOfStock={
                                    outOfStock
                                }
                                lowStock={
                                    lowStock
                                }
                            />

                        </div>


                        <div
                            className="
                                mt-7
                                rounded-2xl
                                border
                                border-[#E7E0D5]
                                bg-[#FAF6EE]
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-end
                                    gap-3
                                "
                            >

                                <div
                                    dir="ltr"
                                    className="
                                        inline-block
                                        text-3xl
                                        font-black
                                        text-[#252525]
                                    "
                                >
                                    {
                                        formatCurrency(
                                            currentPrice
                                        )
                                    }
                                </div>


                                {
                                    hasSale &&
                                    (

                                        <div
                                            dir="ltr"
                                            className="
                                                inline-block
                                                pb-1
                                                text-sm
                                                text-[#918C84]
                                                line-through
                                            "
                                        >
                                            {
                                                formatCurrency(
                                                    product
                                                        .regularPrice
                                                )
                                            }
                                        </div>

                                    )
                                }

                            </div>


                            {
                                hasSale &&
                                (

                                    <div
                                        dir="ltr"
                                        className="
                                            mt-3
                                            inline-flex
                                            rounded-full
                                            bg-[#FBEFEE]
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-bold
                                            text-[#C94A45]
                                        "
                                    >
                                        وفر{" "}
                                        {
                                            formatCurrency(
                                                product
                                                    .regularPrice -
                                                product
                                                    .salePrice
                                            )
                                        }
                                    </div>

                                )
                            }

                        </div>


                        {
                            product.compatibleModels
                                ?.length >
                            0 &&
                            (

                                <div
                                    className="
                                        mt-6
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
                                            gap-2
                                            text-sm
                                            font-black
                                            text-[#252525]
                                        "
                                    >
                                        <Wrench
                                            size={18}
                                        />

                                        الموديلات المتوافقة
                                    </div>


                                    <div
                                        className="
                                            mt-4
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        {
                                            product
                                                .compatibleModels
                                                .map(
                                                    model => (

                                                        <span
                                                            key={
                                                                model
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-[#E7E0D5]
                                                                bg-[#FAF6EE]
                                                                px-3
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-[#4D4A45]
                                                            "
                                                        >
                                                            {model}
                                                        </span>

                                                    )
                                                )
                                        }

                                    </div>

                                </div>

                            )
                        }


                        <div
                            className="
                                mt-6
                                rounded-2xl
                                border
                                border-[#E7E0D5]
                                bg-[#FAF6EE]
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#FFF6DA]
                                        text-[#9A6B00]
                                    "
                                >
                                    <MessageCircle
                                        size={19}
                                    />
                                </div>

                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >

                                    <h2
                                        className="
                                            text-sm
                                            font-black
                                            text-[#252525]
                                        "
                                    >
                                        مش متأكد إن القطعة مناسبة لجهازك؟
                                    </h2>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            leading-6
                                            text-[#6B6862]
                                        "
                                    >
                                        ابعتلنا موديل الجهاز أو صورة القطعة، وفريق تكنو-واي يساعدك تتأكد قبل الطلب.
                                    </p>

                                    <Link
                                        href="/contact"
                                        className="
                                            mt-3
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            bg-[#1F4E5F]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-black
                                            text-white
                                            transition
                                            hover:bg-[#173C49]
                                        "
                                    >
                                        ساعدني أختار القطعة
                                        <ArrowLeft
                                            size={15}
                                        />
                                    </Link>

                                </div>

                            </div>

                        </div>


                        <div
                            className="
                                mt-6
                                border-t
                                border-[#E7E0D5]
                                pt-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-center
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-fit
                                        items-center
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-[#D9D0C3]
                                        bg-[#FFFEFC]
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            increaseQuantity
                                        }
                                        disabled={
                                            outOfStock ||
                                            quantity >=
                                            maxQuantity
                                        }
                                        className="
                                            h-full
                                            w-12
                                            text-lg
                                            font-bold
                                            text-[#4D4A45]
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
                                            min-w-12
                                            items-center
                                            justify-center
                                            border-x
                                            border-[#E7E0D5]
                                            px-3
                                            text-sm
                                            font-black
                                            text-[#252525]
                                        "
                                    >
                                        {quantity}
                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            decreaseQuantity
                                        }
                                        disabled={
                                            quantity <=
                                            1
                                        }
                                        className="
                                            h-full
                                            w-12
                                            text-lg
                                            font-bold
                                            text-[#4D4A45]
                                            hover:bg-[#FAF6EE]
                                            disabled:opacity-30
                                        "
                                    >
                                        −
                                    </button>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleAddToCart
                                    }
                                    disabled={
                                        outOfStock
                                    }
                                    className="
        flex
        h-12
        flex-1
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[#1F4E5F]
        px-6
        text-sm
        font-bold
        text-white
        transition
        hover:bg-[#173C49]
        disabled:cursor-not-allowed
        disabled:bg-[#D9D0C3]
    "
                                >
                                    أضف إلى السلة
                                </button>

                            </div>



                        </div>
{cartMessage && (

    <div
        className={`
            mt-3
            rounded-xl
            px-4
            py-3
            text-sm
            font-semibold
            ${
                cartMessageType ===
                "success"
                    ? "bg-[#EDF5EF] text-[#3F7D58]"
                    : "bg-[#FFF6DA] text-[#9A6B00]"
            }
        `}
    >
        {cartMessage}
    </div>

)}

                        <div
                            className="
                                mt-7
                                grid
                                gap-3
                                sm:grid-cols-3
                            "
                        >

                            <TrustItem
                                icon={
                                    PackageCheck
                                }
                                title="راجع التوافق"
                                text="تأكد من موديل جهازك"
                            />

                            <TrustItem
                                icon={
                                    Truck
                                }
                                title="الشحن"
                                text="توصيل للمحافظات"
                            />

                            <TrustItem
                                icon={
                                    ShieldCheck
                                }
                                title="معلومات واضحة"
                                text="بيانات تساعدك في الاختيار"
                            />

                        </div>

                    </div>

                </div>

            </section>


            <section
                className="
                    border-y
                    border-[#E7E0D5]
                    bg-[#FAF6EE]
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        py-12
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            grid
                            gap-8
                            lg:grid-cols-[1fr_320px]
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-black
                                    text-[#252525]
                                "
                            >
                                وصف المنتج
                            </h2>


                            <div
                                className="
                                    mt-4
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-8
                                    text-[#6B6862]
                                "
                            >
                                {
                                    product.description ||
                                    "لا يوجد وصف إضافي لهذا المنتج حالياً."
                                }
                            </div>

                        </div>


                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#E7E0D5]
                                bg-[#FFFEFC]
                                p-5
                            "
                        >

                            <h3
                                className="
                                    text-sm
                                    font-black
                                    text-[#252525]
                                "
                            >
                                بيانات المنتج
                            </h3>


                            <div
                                className="
                                    mt-4
                                    divide-y
                                    divide-slate-100
                                "
                            >

                                <DataRow
                                    label="الماركة"
                                    value={
                                        product.brand
                                            ?.name ||
                                        "—"
                                    }
                                />

                                <DataRow
                                    label="القسم"
                                    value={
                                        product.category
                                            ?.name ||
                                        "—"
                                    }
                                />

                                <DataRow
                                    label="SKU"
                                    value={
                                        product.sku
                                    }
                                    ltr
                                />

                                {
                                    Number(
                                        product.weight
                                    ) >
                                    0 &&
                                    (

                                        <DataRow
                                            label="الوزن"
                                            value={
                                                product.weight
                                            }
                                        />

                                    )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {
                product.tags
                    ?.length >
                0 &&
                (

                    <section
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
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <Tag
                                size={18}
                                className="
                                    mt-1
                                    shrink-0
                                    text-[#918C84]
                                "
                            />


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                {
                                    product.tags.map(
                                        tag => (

                                            <Link
                                                key={
                                                    tag
                                                }
                                                href={
                                                    `/products?search=${encodeURIComponent(
                                                        tag
                                                    )}`
                                                }
                                                className="
                                                    rounded-full
                                                    bg-[#F4EEE4]
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-semibold
                                                    text-[#6B6862]
                                                    hover:bg-[#EFE6D8]
                                                "
                                            >
                                                {tag}
                                            </Link>

                                        )
                                    )
                                }

                            </div>

                        </div>

                    </section>

                )
            }


            {
                (
                    relatedLoading ||
                    relatedProducts
                        .length >
                    0
                ) &&
                (

                    <section
                        className="
                            border-t
                            border-[#E7E0D5]
                            bg-[#FFFEFC]
                        "
                    >

                        <div
                            className="
                                mx-auto
                                max-w-7xl
                                px-4
                                py-14
                                sm:px-6
                                lg:px-8
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-end
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-2xl
                                            font-black
                                            text-[#252525]
                                        "
                                    >
                                        منتجات مشابهة
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-[#6B6862]
                                        "
                                    >
                                        منتجات أخرى من نفس القسم
                                    </p>

                                </div>


                                <Link
                                    href={
                                        `/products?category=${product.category?._id || ""}`
                                    }
                                    className="
                                        hidden
                                        items-center
                                        gap-2
                                        text-sm
                                        font-bold
                                        text-[#4D4A45]
                                        hover:text-[#1F4E5F]
                                        sm:flex
                                    "
                                >
                                    عرض القسم

                                    <ArrowLeft
                                        size={16}
                                    />
                                </Link>

                            </div>


                            {
                                relatedLoading
                                    ? (

                                        <div
                                            className="
                                                mt-7
                                                grid
                                                grid-cols-2
                                                gap-4
                                                md:grid-cols-4
                                            "
                                        >

                                            {
                                                Array.from({
                                                    length:
                                                        4,
                                                }).map(
                                                    (
                                                        _,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            className="
                                                                aspect-[3/4]
                                                                animate-pulse
                                                                rounded-2xl
                                                                bg-[#F4EEE4]
                                                            "
                                                        />

                                                    )
                                                )
                                            }

                                        </div>

                                    )
                                    : (

                                        <div
                                            className="
                                                mt-7
                                                grid
                                                grid-cols-2
                                                gap-4
                                                md:grid-cols-4
                                            "
                                        >

                                            {
                                                relatedProducts
                                                    .map(
                                                        item => (

                                                            <ProductCard
                                                                key={
                                                                    item._id
                                                                }
                                                                product={
                                                                    item
                                                                }
                                                            />

                                                        )
                                                    )
                                            }

                                        </div>

                                    )
                            }

                        </div>

                    </section>

                )
            }

        </>

    );

}


function StockStatus({
    outOfStock,
    lowStock,
}) {

    if (outOfStock) {

        return (

            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-bold
                    text-[#C94A45]
                "
            >
                <XCircle
                    size={15}
                />

                غير متوفر
            </span>

        );

    }


    if (lowStock) {

        return (

            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-bold
                    text-[#9A6B00]
                "
            >
                <Boxes
                    size={15}
                />

                كمية محدودة
            </span>

        );

    }


    return (

        <span
            className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-bold
                text-[#3F7D58]
            "
        >
            <CheckCircle2
                size={15}
            />

            متوفر
        </span>

    );

}


function TrustItem({
    icon: Icon,
    title,
    text,
}) {

    return (

        <div
            className="
                flex
                gap-3
                rounded-xl
                bg-[#FAF6EE]
                p-3
            "
        >

            <Icon
                size={18}
                className="
                    mt-0.5
                    shrink-0
                    text-[#6B6862]
                "
            />


            <div>

                <div
                    className="
                        text-xs
                        font-bold
                        text-[#252525]
                    "
                >
                    {title}
                </div>


                <div
                    className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-[#6B6862]
                    "
                >
                    {text}
                </div>

            </div>

        </div>

    );

}


function DataRow({
    label,
    value,
    ltr = false,
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
                dir={
                    ltr
                        ? "ltr"
                        : undefined
                }
                className="
                    text-left
                    font-semibold
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
                min-h-[600px]
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
                    size={30}
                    className="
                        mx-auto
                        animate-spin
                        text-[#918C84]
                    "
                />


                <div
                    className="
                        mt-3
                        text-sm
                        text-[#6B6862]
                    "
                >
                    جاري تحميل المنتج...
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

        <div
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
                    rounded-2xl
                    border
                    border-[#E8C3C0]
                    bg-[#FBEFEE]
                    px-6
                    py-14
                    text-center
                "
            >

                <div
                    className="
                        text-lg
                        font-black
                        text-[#A93D38]
                    "
                >
                    تعذر عرض المنتج
                </div>


                <p
                    className="
                        mt-2
                        text-sm
                        text-[#C94A45]
                    "
                >
                    {message}
                </p>


                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
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
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[#C94A45]
                            px-5
                            py-2.5
                            text-sm
                            font-bold
                            text-white
                        "
                    >
                        <RefreshCw
                            size={16}
                        />

                        إعادة المحاولة
                    </button>


                    <Link
                        href="/products"
                        className="
                            rounded-xl
                            border
                            border-red-300
                            bg-[#FFFEFC]
                            px-5
                            py-2.5
                            text-sm
                            font-bold
                            text-[#C94A45]
                        "
                    >
                        العودة للمنتجات
                    </Link>

                </div>

            </div>

        </div>

    );

}