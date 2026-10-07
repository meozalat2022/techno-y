"use client";


import Link from "next/link";

import {
    Heart,
    ShoppingBag,
} from "lucide-react";

import ProductCard from
    "@/components/store/ProductCard";

import { useAuth } from
    "@/context/AuthContext";


export default function WishlistPage() {

    const {
        wishlist,
        wishlistLoading,
        isAuthenticated,
    } =
        useAuth();


    if (!isAuthenticated) {

        return (

            <main
                dir="rtl"
                className="
                    mx-auto
                    flex
                    min-h-[60vh]
                    max-w-7xl
                    items-center
                    justify-center
                    px-4
                    py-16
                    sm:px-6
                    lg:px-8
                "
            >

                <div
                    className="
                        flex
                        max-w-md
                        flex-col
                        items-center
                        text-center
                    "
                >

                    <div
                        className="
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-full
                            bg-[#FAF0EF]
                        "
                    >

                        <Heart
                            size={36}
                            className="
                                text-[#C94A45]
                            "
                        />

                    </div>


                    <h1
                        className="
                            mt-6
                            text-2xl
                            font-black
                            text-[#252525]
                        "
                    >
                        قائمة المفضلة
                    </h1>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-7
                            text-[#918C84]
                        "
                    >
                        سجل الدخول لمشاهدة المنتجات
                        التي أضفتها إلى قائمة المفضلة.
                    </p>


                    <Link
                        href="/account/login"
                        className="
                            mt-6
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
                        تسجيل الدخول
                    </Link>

                </div>

            </main>

        );

    }


    if (wishlistLoading) {

        return (

            <main
                dir="rtl"
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
                        h-8
                        w-48
                        animate-pulse
                        rounded-lg
                        bg-slate-200
                    "
                />


                <div
                    className="
                        mt-8
                        grid
                        grid-cols-2
                        gap-4
                        md:grid-cols-3
                        xl:grid-cols-4
                    "
                >

                    {
                        Array.from({
                            length: 8,
                        }).map(
                            (_, index) => (

                                <div
                                    key={index}
                                    className="
                                        aspect-[3/4]
                                        animate-pulse
                                        rounded-2xl
                                        bg-slate-100
                                    "
                                />

                            )
                        )
                    }

                </div>

            </main>

        );

    }


    return (

        <main
            dir="rtl"
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
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Heart
                            size={24}
                            className="
                                fill-[#C94A45]
                                text-[#C94A45]
                            "
                        />

                        <h1
                            className="
                                text-2xl
                                font-black
                                text-[#252525]
                            "
                        >
                            قائمة المفضلة
                        </h1>

                    </div>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-[#918C84]
                        "
                    >
                        {wishlist.length}{" "}
                        {wishlist.length === 1
                            ? "منتج"
                            : "منتجات"}
                    </p>

                </div>

            </div>


            {
                wishlist.length === 0
                    ? (

                        <div
                            className="
                                flex
                                min-h-[45vh]
                                flex-col
                                items-center
                                justify-center
                                text-center
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-24
                                    w-24
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#FAF6EE]
                                "
                            >

                                <Heart
                                    size={42}
                                    className="
                                        text-[#B8AFA2]
                                    "
                                />

                            </div>


                            <h2
                                className="
                                    mt-6
                                    text-xl
                                    font-black
                                    text-[#252525]
                                "
                            >
                                قائمة المفضلة فارغة
                            </h2>


                            <p
                                className="
                                    mt-2
                                    max-w-md
                                    text-sm
                                    leading-7
                                    text-[#918C84]
                                "
                            >
                                أضف المنتجات التي تعجبك
                                إلى قائمة المفضلة للرجوع
                                إليها لاحقًا.
                            </p>


                            <Link
                                href="/products"
                                className="
                                    mt-6
                                    flex
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

                                <ShoppingBag
                                    size={18}
                                />

                                تصفح المنتجات

                            </Link>

                        </div>

                    )
                    : (

                        <div
                            className="
                                mt-8
                                grid
                                grid-cols-2
                                gap-4
                                md:grid-cols-3
                                xl:grid-cols-4
                            "
                        >

                            {
                                wishlist.map(
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

                    )
            }

        </main>

    );

}