"use client";


import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    Menu,
    Search,
    ShoppingCart,
    UserRound,
    Heart,
    X,
    Headphones,
} from "lucide-react";

import {
    useCart,
} from "@/context/CartContext";
import {
    useAuth,
} from "@/context/AuthContext";

const navigation = [

    {
        label: "الرئيسية",
        href: "/",
    },

    {
        label: "كل المنتجات",
        href: "/products",
    },

    {
        label: "المنتجات المميزة",
        href: "/products?featured=true",
    },

    {
        label: "تواصل معنا",
        href: "/contact",
    },

];


export default function StoreHeader() {

    const {
        itemCount,
        hydrated,
    } =
        useCart();
    const {
        user,
        loading: authLoading,
        wishlistCount,
    } =
        useAuth();


    const [
        mobileOpen,
        setMobileOpen,
    ] =
        useState(false);


    const [
        search,
        setSearch,
    ] =
        useState("");


    useEffect(
        () => {

            if (!mobileOpen) {
                return;
            }


            const previousOverflow =
                document.body.style
                    .overflow;


            document.body.style
                .overflow =
                "hidden";


            return () => {

                document.body.style
                    .overflow =
                    previousOverflow;

            };

        },
        [
            mobileOpen,
        ]
    );


    const handleSearch =
        event => {

            event.preventDefault();


            const query =
                search.trim();


            if (!query) {
                return;
            }


            window.location.href =
                `/products?search=${encodeURIComponent(
                    query
                )}`;

        };


    return (
        <>

            <header
                className="
                    relative
                    z-40
                    bg-white
                "
            >

                <div
                    className="
                        border-b
                        border-[#E7E0D5]
                        bg-[#1F4E5F]
                        text-white
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            max-w-7xl
                            items-center
                            justify-between
                            gap-4
                            px-4
                            py-2
                            text-xs
                            sm:px-6
                            lg:px-8
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-white/90
                            "
                        >
                            <Headphones
                                size={14}
                            />

                            <span>
                                متخصصون في قطع غيار
                                الأجهزة المنزلية
                            </span>
                        </div>


                        <div
                            className="
                                hidden
                                text-white/65
                                sm:block
                            "
                        >
                            راحة بيتك تبدأ من القطعة
                            الصح
                        </div>

                    </div>

                </div>


                <div
                    className="
                        border-b
                        border-[#E7E0D5]
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-[76px]
                            max-w-7xl
                            items-center
                            gap-3
                            px-4
                            sm:px-6
                            lg:px-8
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                () =>
                                    setMobileOpen(
                                        true
                                    )
                            }
                            aria-label="فتح القائمة"
                            className="
                                rounded-xl
                                border
                                border-[#E7E0D5]
                                p-2.5
                                text-[#6B6862]
                                hover:bg-[#FAF6EE]
                                lg:hidden
                            "
                        >
                            <Menu
                                size={21}
                            />
                        </button>


                        <Link
                            href="/"
                            className="
                                shrink-0
                                text-xl
                                font-black
                                tracking-tight
                                text-[#252525]
                                sm:text-2xl
                            "
                        >
                            تكنو-واي
                        </Link>


                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="
                                mx-4
                                hidden
                                min-w-0
                                flex-1
                                lg:block
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-[#E7E0D5]
                                    bg-[#FAF6EE]
                                    transition
                                    focus-within:border-[#1F4E5F]
                                    focus-within:bg-white
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        pr-4
                                        text-white/65
                                    "
                                >
                                    <Search
                                        size={19}
                                    />
                                </div>


                                <input
                                    value={search}
                                    onChange={
                                        event =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                    }
                                    placeholder="ابحث باسم القطعة، الماركة أو الموديل..."
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        px-3
                                        text-sm
                                        text-[#252525]
                                        outline-none
                                        placeholder:text-[#6B6862]/70
                                    "
                                />


                                <button
                                    type="submit"
                                    className="
                                        bg-[#173C49]
                                        px-6
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#173C49]
                                    "
                                >
                                    بحث
                                </button>

                            </div>

                        </form>


                        <div
                            className="
                                mr-auto
                                flex
                                items-center
                                gap-1
                                sm:gap-2
                            "
                        >

                            <Link
                                href={
                                    user
                                        ? "/account"
                                        : "/account/login"
                                }
                                aria-label="حسابي"
                                className="
        flex
        h-11
        items-center
        gap-2
        rounded-xl
        px-2.5
        text-[#6B6862]
        transition
        hover:bg-[#FAF6EE]
        sm:px-3
    "
                            >
                                <UserRound
                                    size={21}
                                />

                                <span
                                    className="
            hidden
            text-sm
            font-medium
            md:inline
        "
                                >
                                    {
                                        !authLoading &&
                                            user
                                            ? user.firstName
                                            : "حسابي"
                                    }
                                </span>
                            </Link>
                            <WishlistLink
                                wishlistCount={
                                    user
                                        ? wishlistCount
                                        : 0
                                }
                            />

                            <CartLink
                                itemCount={
                                    hydrated
                                        ? itemCount
                                        : 0
                                }
                            />

                        </div>

                    </div>


                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            px-4
                            pb-4
                            sm:px-6
                            lg:hidden
                        "
                    >

                        <form
                            onSubmit={
                                handleSearch
                            }
                        >

                            <div
                                className="
                                    flex
                                    h-11
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-[#E7E0D5]
                                    bg-[#FAF6EE]
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        pr-3
                                        text-white/65
                                    "
                                >
                                    <Search
                                        size={18}
                                    />
                                </div>


                                <input
                                    value={search}
                                    onChange={
                                        event =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                    }
                                    placeholder="ابحث عن قطعة الغيار..."
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        px-3
                                        text-sm
                                        text-[#252525]
                                        outline-none
                                        placeholder:text-[#6B6862]/70
                                    "
                                />


                                <button
                                    type="submit"
                                    className="
                                        bg-[#173C49]
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    بحث
                                </button>

                            </div>

                        </form>

                    </div>

                </div>


                <nav
                    className="
                        hidden
                        border-b
                        border-[#E7E0D5]
                        bg-white
                        lg:block
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-13
                            max-w-7xl
                            items-center
                            gap-1
                            px-8
                        "
                    >

                        {
                            navigation.map(
                                item => (

                                    <Link
                                        key={
                                            item.href
                                        }
                                        href={
                                            item.href
                                        }
                                        className="
                                            rounded-lg
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            text-[#6B6862]
                                            transition
                                            hover:bg-[#FAF6EE]
                                            hover:text-[#252525]
                                        "
                                    >
                                        {
                                            item.label
                                        }
                                    </Link>

                                )
                            )
                        }

                    </div>

                </nav>

            </header>


            {
                mobileOpen &&
                (

                    <MobileMenu
                        itemCount={
                            hydrated
                                ? itemCount
                                : 0
                        }
                        wishlistCount={
                            user
                                ? wishlistCount
                                : 0
                        }
                        user={user}
                        authLoading={
                            authLoading
                        }
                        onClose={
                            () =>
                                setMobileOpen(
                                    false
                                )
                        }
                    />

                )
            }

        </>
    );

}


function CartLink({
    itemCount,
}) {

    return (

        <Link
            href="/cart"
            aria-label="سلة التسوق"
            className="
                relative
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                px-2.5
                text-[#6B6862]
                transition
                hover:bg-[#FAF6EE]
                sm:px-3
            "
        >

            <span
                className="
                    relative
                "
            >

                <ShoppingCart
                    size={22}
                />


                {
                    itemCount >
                    0 &&
                    (

                        <span
                            className="
                                absolute
                                -left-2
                                -top-2
                                flex
                                h-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-[#1F4E5F]
                                px-1
                                text-[10px]
                                font-bold
                                text-white
                            "
                        >
                            {
                                itemCount >
                                    99
                                    ? "99+"
                                    : itemCount
                            }
                        </span>

                    )
                }

            </span>


            <span
                className="
                    hidden
                    text-sm
                    font-medium
                    md:inline
                "
            >
                السلة
            </span>

        </Link>

    );

}

function WishlistLink({
    wishlistCount,
}) {

    return (

        <Link
            href="/wishlist"
            aria-label="قائمة المفضلة"
            className="
                relative
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                px-2.5
                text-[#6B6862]
                transition
                hover:bg-[#FAF6EE]
                sm:px-3
            "
        >

            <span
                className="
                    relative
                "
            >

                <Heart
                    size={22}
                />


                {
                    wishlistCount >
                    0 &&
                    (

                        <span
                            className="
                                absolute
                                -left-2
                                -top-2
                                flex
                                h-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-[#C94A45]
                                px-1
                                text-[10px]
                                font-bold
                                text-white
                            "
                        >
                            {
                                wishlistCount >
                                    99
                                    ? "99+"
                                    : wishlistCount
                            }
                        </span>

                    )
                }

            </span>


            <span
                className="
                    hidden
                    text-sm
                    font-medium
                    md:inline
                "
            >
                المفضلة
            </span>

        </Link>

    );

}


function MobileMenu({
    itemCount,
    wishlistCount,
    user,
    authLoading,
    onClose,
}) {

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                lg:hidden
            "
        >

            <button
                type="button"
                aria-label="إغلاق القائمة"
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    bg-black/45
                "
            />


            <aside
                className="
                    absolute
                    right-0
                    top-0
                    h-full
                    w-[290px]
                    max-w-[86vw]
                    overflow-y-auto
                    bg-white
                    shadow-2xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[#E7E0D5]
                        px-5
                        py-5
                    "
                >

                    <div>

                        <div
                            className="
                                text-xl
                                font-black
                                text-[#252525]
                            "
                        >
                            تكنو-واي
                        </div>

                        <div
                            className="
                                mt-1
                                text-xs
                                text-[#6B6862]
                            "
                        >
                            قطع غيار الأجهزة المنزلية
                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق القائمة"
                        className="
                            rounded-lg
                            p-2
                            text-[#6B6862]
                            hover:bg-[#FAF6EE]
                        "
                    >
                        <X
                            size={20}
                        />
                    </button>

                </div>


                <nav
                    className="
                        space-y-1
                        p-4
                    "
                >

                    {
                        navigation.map(
                            item => (

                                <Link
                                    key={
                                        item.href
                                    }
                                    href={
                                        item.href
                                    }
                                    onClick={
                                        onClose
                                    }
                                    className="
                                        block
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-[#6B6862]
                                        hover:bg-[#FAF6EE]
                                        hover:text-[#252525]
                                    "
                                >
                                    {
                                        item.label
                                    }
                                </Link>

                            )
                        )
                    }

                </nav>


                <div
                    className="
                        mx-4
                        border-t
                        border-[#E7E0D5]
                        pt-4
                    "
                >

                    <Link
                        href={
                            user
                                ? "/account"
                                : "/account/login"
                        }
                        onClick={onClose}
                        className="
        flex
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
        text-[#6B6862]
        hover:bg-[#FAF6EE]
    "
                    >
                        <UserRound
                            size={19}
                        />

                        {
                            !authLoading &&
                                user
                                ? user.firstName
                                : "حسابي"
                        }
                    </Link>
                    <Link
                        href="/wishlist"
                        onClick={onClose}
                        className="
        flex
        items-center
        justify-between
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
        text-[#6B6862]
        hover:bg-[#FAF6EE]
    "
                    >

                        <span
                            className="
            flex
            items-center
            gap-3
        "
                        >

                            <Heart
                                size={19}
                            />

                            قائمة المفضلة

                        </span>


                        {
                            user &&
                            wishlistCount >
                            0 &&
                            (

                                <span
                                    className="
                    rounded-full
                    bg-[#C94A45]
                    px-2
                    py-0.5
                    text-xs
                    font-bold
                    text-white
                "
                                >
                                    {
                                        wishlistCount >
                                            99
                                            ? "99+"
                                            : wishlistCount
                                    }
                                </span>

                            )
                        }

                    </Link>

                    <Link
                        href="/cart"
                        onClick={onClose}
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-[#6B6862]
                            hover:bg-[#FAF6EE]
                        "
                    >

                        <span
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <ShoppingCart
                                size={19}
                            />

                            سلة التسوق
                        </span>


                        {
                            itemCount >
                            0 &&
                            (

                                <span
                                    className="
                                        rounded-full
                                        bg-[#1F4E5F]
                                        px-2
                                        py-0.5
                                        text-xs
                                        font-bold
                                        text-white
                                    "
                                >
                                    {itemCount}
                                </span>

                            )
                        }

                    </Link>

                </div>

            </aside>

        </div>

    );

}