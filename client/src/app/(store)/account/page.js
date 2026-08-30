"use client";


import {
    useEffect,
} from "react";

import Link from "next/link";

import {
    useRouter,
} from "next/navigation";

import {
    Coins,
    LogOut,
    PackageSearch,
    UserRound,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";
import {
    useCart,
} from "@/context/CartContext";

export default function AccountPage() {

    const router =
        useRouter();


    const {
        user,
        loading,
        logout,
    } =
        useAuth();
        const {
    clearCart,
} =
    useCart();


    useEffect(
        () => {

            if (
                !loading &&
                !user
            ) {

                router.replace(
                    "/account/login"
                );

            }

        },
        [
            loading,
            user,
            router,
        ]
    );


    if (
        loading ||
        !user
    ) {

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
                جاري تحميل الحساب...
            </div>

        );

    }


   const handleLogout =
    async () => {

        await logout();

        clearCart();

        router.push("/");

    };

    return (

        <section
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
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <div
                        className="
                            text-sm
                            font-semibold
                            text-[#6B6862]
                        "
                    >
                        حسابي
                    </div>


                    <h1
                        className="
                            mt-1
                            text-3xl
                            font-black
                            text-[#252525]
                        "
                    >
                        أهلاً، {user.firstName}
                    </h1>

                </div>


                <button
                    type="button"
                    onClick={
                        handleLogout
                    }
                    className="
                        flex
                        w-fit
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[#D9D0C4]
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-[#56524D]
                        hover:bg-[#FAF6EE]
                    "
                >
                    <LogOut size={17} />

                    تسجيل الخروج
                </button>

            </div>


            <div
                className="
                    mt-8
                    grid
                    gap-5
                    md:grid-cols-3
                "
            >

                <div
                    className="
                        rounded-2xl
                        border
                        border-[#E7E0D5]
                        bg-[#FFFEFC]
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#F4EDE2]
                            text-[#56524D]
                        "
                    >
                        <UserRound
                            size={21}
                        />
                    </div>


                    <h2
                        className="
                            mt-4
                            font-black
                            text-[#252525]
                        "
                    >
                        بيانات الحساب
                    </h2>


                    <div
                        className="
                            mt-4
                            divide-y
                            divide-[#EFE9E0]
                        "
                    >

                        <Row
                            label="الاسم"
                            value={
                                `${user.firstName} ${user.lastName}`
                            }
                        />

                        <Row
                            label="البريد الإلكتروني"
                            value={
                                user.email
                            }
                            ltr
                        />

                        <Row
                            label="الهاتف"
                            value={
                                user.phone ||
                                "—"
                            }
                            ltr
                        />

                    </div>

                </div>


                <Link
                    href="/account/loyalty"
                    className="group rounded-2xl border border-[#E7E0D5] bg-[#FFFEFC] p-6 transition hover:border-[#D9D0C4] hover:shadow-sm"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5B82E]/20 text-[#8A6400]"><Coins size={21} /></div>
                    <h2 className="mt-4 font-black text-[#252525]">نقاطي</h2>
                    <p className="mt-2 text-sm leading-7 text-[#6B6862]">تابع نقاط الولاء المتاحة والمعلقة وسجل عملياتك.</p>
                    <div className="mt-5 text-sm font-bold text-[#3C3935]">عرض نقاطي</div>
                </Link>


                <Link
                    href="/account/orders"
                    className="
                        group
                        rounded-2xl
                        border
                        border-[#E7E0D5]
                        bg-[#FFFEFC]
                        p-6
                        transition
                        hover:border-[#D9D0C4]
                        hover:shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#1F4E5F]
                            text-white
                        "
                    >
                        <PackageSearch
                            size={21}
                        />
                    </div>


                    <h2
                        className="
                            mt-4
                            font-black
                            text-[#252525]
                        "
                    >
                        طلباتي
                    </h2>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-7
                            text-[#6B6862]
                        "
                    >
                        تابع الطلبات السابقة
                        والحالية وحالة كل طلب.
                    </p>


                    <div
                        className="
                            mt-5
                            text-sm
                            font-bold
                            text-[#3C3935]
                        "
                    >
                        عرض الطلبات
                    </div>

                </Link>

            </div>

        </section>

    );

}


function Row({
    label,
    value,
    ltr = false,
}) {

    return (

        <div
            className="
                flex
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