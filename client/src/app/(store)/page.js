"use client";


import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    ArrowLeft,
    Boxes,
    PackageSearch,
    RefreshCw,
    Search,
    ShieldCheck,
    Truck,
    Wrench,
} from "lucide-react";

import storeHomeService from
    "@/services/storeHomeService";

import CategoryCard from
    "@/components/store/CategoryCard";

import ProductCard from
    "@/components/store/ProductCard";


export default function StoreHomePage() {

    const [
        categories,
        setCategories,
    ] =
        useState([]);


    const [
        featuredProducts,
        setFeaturedProducts,
    ] =
        useState([]);


    const [
        newestProducts,
        setNewestProducts,
    ] =
        useState([]);


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

            const loadHome =
                async () => {

                    setLoading(true);

                    setError("");


                    try {

                        const [
                            categoriesResponse,
                            featuredResponse,
                            newestResponse,
                        ] =
                            await Promise.all([

                                storeHomeService
                                    .getCategories(),

                                storeHomeService
                                    .getFeaturedProducts(
                                        8
                                    ),

                                storeHomeService
                                    .getNewestProducts(
                                        8
                                    ),

                            ]);


                        setCategories(
                            categoriesResponse
                                .data ||
                            []
                        );


                        setFeaturedProducts(
                            featuredResponse
                                .data ||
                            []
                        );


                        setNewestProducts(
                            newestResponse
                                .data ||
                            []
                        );


                    } catch (error) {

                        setError(

                            error.response
                                ?.data
                                ?.message ||
                            "تعذر تحميل بيانات المتجر."

                        );

                    } finally {

                        setLoading(false);

                    }

                };


            loadHome();

        },
        []
    );


    return (

        <>

            <HeroSection />


            <TrustStrip />


            {
                loading
                    ? (

                        <LoadingState />

                    )
                    : error
                        ? (

                            <ErrorState
                                message={
                                    error
                                }
                            />

                        )
                        : (
                            <>

                                <CategoriesSection
                                    categories={
                                        categories
                                    }
                                />


                                {
                                    featuredProducts
                                        .length >
                                    0 &&
                                    (

                                        <ProductsSection
                                            title="منتجات مميزة"
                                            description="اختيارات مميزة من منتجات تكنو-واي"
                                            products={
                                                featuredProducts
                                            }
                                        />

                                    )
                                }


                                <HelpSection />


                                {
                                    newestProducts
                                        .length >
                                    0 &&
                                    (

                                        <ProductsSection
                                            title="وصل حديثاً"
                                            description="أحدث المنتجات التي تمت إضافتها إلى المتجر"
                                            products={
                                                newestProducts
                                            }
                                        />

                                    )
                                }

                            </>
                        )
            }

        </>

    );

}


function HeroSection() {

    return (

        <section
            className="
                overflow-hidden
                border-b
                border-[#E7E0D5]
                bg-[#FAF6EE]
            "
        >

            <div
                className="
                    mx-auto
                    grid
                    max-w-7xl
                    gap-10
                    px-4
                    py-14
                    sm:px-6
                    md:py-20
                    lg:grid-cols-[1.15fr_.85fr]
                    lg:items-center
                    lg:px-8
                    lg:py-24
                "
            >

                <div>

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#E7E0D5]
                            bg-white
                            px-4
                            py-2
                            text-xs
                            font-bold
                            text-[#6B6862]
                        "
                    >

                        <Wrench
                            size={15}
                        />

                        متخصصون في قطع غيار
                        الأجهزة المنزلية

                    </div>


                    <h1
                        className="
                            mt-6
                            max-w-3xl
                            text-3xl
                            font-black
                            leading-[1.45]
                            text-[#252525]
                            sm:text-4xl
                            lg:text-5xl
                        "
                    >
                        قطعة جهازك عندنا…
                        وراحة بيتك ترجع 💛
                    </h1>


                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-base
                            leading-8
                            text-[#6B6862]
                        "
                    >
                        قطع غيار للتكييفات والثلاجات والغسالات والمكانس والخلاطات وغيرها، مع مساعدتك في اختيار القطعة المناسبة لجهازك.
                    </p>


                    <div
                        className="
                            mt-8
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

                        <Link
                            href="/products"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-[#1F4E5F]
                                px-6
                                py-3
                                text-sm
                                font-bold
                                text-white
                                transition
                                hover:bg-[#173C49]
                            "
                        >
                            دور على قطعتك

                            <ArrowLeft
                                size={17}
                            />
                        </Link>


                        <a
                            href="#categories"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-[#E7E0D5]
                                bg-white
                                px-6
                                py-3
                                text-sm
                                font-bold
                                text-[#6B6862]
                                transition
                                hover:bg-[#FAF6EE]
                            "
                        >
                            <Boxes
                                size={17}
                            />

                            تصفح الأقسام
                        </a>

                    </div>

                </div>


                <div
                    className="
                        rounded-3xl
                        border
                        border-[#E7E0D5]
                        bg-white
                        p-6
                        shadow-sm
                        sm:p-8
                    "
                >

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[#1F4E5F]
                            text-white
                        "
                    >
                        <PackageSearch
                            size={23}
                        />
                    </div>


                    <h2
                        className="
                            mt-5
                            text-xl
                            font-black
                            text-[#252525]
                        "
                    >
                        مش عارف تختار القطعة؟
                    </h2>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-7
                            text-[#6B6862]
                        "
                    >
                        ابدأ باسم الجهاز والماركة،
                        وبعدها راجع اسم القطعة
                        والموديلات المتوافقة قبل
                        الشراء.
                    </p>


                    <div
                        className="
                            mt-6
                            space-y-3
                        "
                    >

                        <GuideStep
                            number="١"
                            title="حدد نوع الجهاز"
                        />

                        <GuideStep
                            number="٢"
                            title="حدد الماركة والموديل"
                        />

                        <GuideStep
                            number="٣"
                            title="راجع توافق القطعة"
                        />

                    </div>

                </div>

            </div>

        </section>

    );

}


function TrustStrip() {

    const items = [

        {
            icon:
                Search,

            title:
                "اختيار أسهل",

            text:
                "نساعدك توصل للقطعة المناسبة لجهازك",
        },

        {
            icon:
                ShieldCheck,

            title:
                "صور ومعلومات واضحة",

            text:
                "علشان تعرف إنت بتشتري إيه",
        },

        {
            icon:
                Truck,

            title:
                "توصيل لحد باب البيت",

            text:
                "من غير مشاوير ودوران",
        },

        {
            icon:
                ShieldCheck,

            title:
                "دعم بعد الشراء",

            text:
                "لأن علاقتنا مش بتنتهي بمجرد الطلب",
        },

    ];


    return (

        <section
            className="
                border-b
                border-[#E7E0D5]
                bg-white
            "
        >

            <div
                className="
                    mx-auto
                    grid
                    max-w-7xl
                    gap-5
                    px-4
                    py-7
                    sm:px-6
                    md:grid-cols-2
                    lg:grid-cols-4
                    lg:px-8
                "
            >

                {
                    items.map(
                        item => {

                            const Icon =
                                item.icon;


                            return (

                                <div
                                    key={
                                        item.title
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[#F5B82E]/15
                                            text-[#1F4E5F]
                                        "
                                    >
                                        <Icon
                                            size={19}
                                        />
                                    </div>


                                    <div>

                                        <div
                                            className="
                                                text-sm
                                                font-bold
                                                text-[#252525]
                                            "
                                        >
                                            {
                                                item.title
                                            }
                                        </div>


                                        <div
                                            className="
                                                mt-1
                                                text-xs
                                                text-[#6B6862]
                                            "
                                        >
                                            {
                                                item.text
                                            }
                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )
                }

            </div>

        </section>

    );

}


function CategoriesSection({
    categories,
}) {

    if (
        categories.length ===
        0
    ) {

        return null;

    }


    return (

        <section
            id="categories"
            className="
                mx-auto
                max-w-7xl
                px-4
                py-14
                sm:px-6
                lg:px-8
            "
        >

            <SectionHeader
                title="تصفح حسب القسم"
                description="اختار نوع الجهاز وابدأ في الوصول للقطعة المناسبة"
                href="/products"
            />


            <div
                className="
                    mt-7
                    grid
                    grid-cols-2
                    gap-4
                    md:grid-cols-3
                    lg:grid-cols-4
                "
            >

                {
                    categories
                        .slice(0, 8)
                        .map(
                            category => (

                                <CategoryCard
                                    key={
                                        category._id
                                    }
                                    category={
                                        category
                                    }
                                />

                            )
                        )
                }

            </div>

        </section>

    );

}


function ProductsSection({
    title,
    description,
    products,
}) {

    return (

        <section
            className="
                border-t
                border-[#E7E0D5]
                bg-[#FAF6EE]/70
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

                <SectionHeader
                    title={title}
                    description={
                        description
                    }
                    href="/products"
                />


                <div
                    className="
                        mt-7
                        grid
                        grid-cols-2
                        gap-4
                        md:grid-cols-3
                        xl:grid-cols-4
                    "
                >

                    {
                        products.map(
                            product => (

                                <ProductCard
                                    key={
                                        product._id
                                    }
                                    product={
                                        product
                                    }
                                />

                            )
                        )
                    }

                </div>

            </div>

        </section>

    );

}


function HelpSection() {

    return (

        <section
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
                    overflow-hidden
                    rounded-3xl
                    bg-[#1F4E5F]
                    px-6
                    py-10
                    text-white
                    sm:px-10
                    lg:flex
                    lg:items-center
                    lg:justify-between
                    lg:gap-10
                "
            >

                <div>

                    <div
                        className="
                            text-sm
                            font-bold
                            text-white/70
                        "
                    >
                        محتاج مساعدة؟
                    </div>


                    <h2
                        className="
                            mt-2
                            text-2xl
                            font-black
                        "
                    >
                        مش متأكد إن القطعة مناسبة لجهازك؟
                    </h2>


                    <p
                        className="
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-7
                            text-white/70
                        "
                    >
                        تواصل معانا ببيانات الجهاز أو الموديل، ونساعدك تتأكد من اختيار القطعة المناسبة قبل الطلب.
                    </p>

                </div>


                <Link
                    href="/contact"
                    className="
                        mt-6
                        inline-flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        bg-white
                        px-6
                        py-3
                        text-sm
                        font-bold
                        text-[#252525]
                        lg:mt-0
                    "
                >
                    ساعدني أختار القطعة

                    <ArrowLeft
                        size={17}
                    />
                </Link>

            </div>

        </section>

    );

}


function SectionHeader({
    title,
    description,
    href,
}) {

    return (

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
                    {title}
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        text-[#6B6862]
                    "
                >
                    {description}
                </p>

            </div>


            <Link
                href={href}
                className="
                    hidden
                    shrink-0
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-[#6B6862]
                    hover:text-[#252525]
                    sm:flex
                "
            >
                عرض الكل

                <ArrowLeft
                    size={16}
                />
            </Link>

        </div>

    );

}


function GuideStep({
    number,
    title,
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-3
                rounded-xl
                bg-[#FAF6EE]
                p-3
            "
        >

            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-sm
                    font-black
                    text-[#252525]
                    shadow-sm
                "
            >
                {number}
            </div>


            <span
                className="
                    text-sm
                    font-semibold
                    text-[#6B6862]
                "
            >
                {title}
            </span>

        </div>

    );

}


function LoadingState() {

    return (

        <div
            className="
                flex
                min-h-[420px]
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
                        text-white/70
                    "
                />


                <div
                    className="
                        mt-3
                        text-sm
                        text-[#6B6862]
                    "
                >
                    جاري تحميل المتجر...
                </div>

            </div>

        </div>

    );

}


function ErrorState({
    message,
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
                    p-6
                    text-center
                "
            >

                <p
                    className="
                        text-sm
                        text-red-700
                    "
                >
                    {message}
                </p>


                <button
                    type="button"
                    onClick={
                        () =>
                            window.location
                                .reload()
                    }
                    className="
                        mt-4
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