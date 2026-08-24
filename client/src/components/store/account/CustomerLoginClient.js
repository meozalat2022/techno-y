"use client";


import {
    useState,
} from "react";

import Link from "next/link";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    LockKeyhole,
    Mail,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";


export default function CustomerLoginClient() {

    const router =
        useRouter();


    const searchParams =
        useSearchParams();


    const {
        login,
        logout,
    } =
        useAuth();


    const [
        email,
        setEmail,
    ] =
        useState("");


    const [
        password,
        setPassword,
    ] =
        useState("");


    const [
        error,
        setError,
    ] =
        useState("");


    const [
        loading,
        setLoading,
    ] =
        useState(false);


    const handleSubmit =
        async event => {

            event.preventDefault();

            setError("");

            setLoading(true);


            try {

                const user =
                    await login({
                        email:
                            email.trim(),
                        password,
                    });


                if (
                    user.role ===
                    "admin"
                ) {

                    await logout();


                    setError(
                        "استخدم صفحة دخول الإدارة لتسجيل الدخول كمسؤول."
                    );

                    return;

                }


                const next =
                    searchParams.get(
                        "next"
                    );


                router.push(
                    next &&
                    next.startsWith("/")
                        ? next
                        : "/account"
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    "تعذر تسجيل الدخول."

                );

            } finally {

                setLoading(false);

            }

        };


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
                    mx-auto
                    max-w-md
                    rounded-3xl
                    border
                    border-[#E7E0D5]
                    bg-[#FFFEFC]
                    p-6
                    shadow-sm
                    sm:p-8
                "
            >

                <div className="text-center">

                    <h1
                        className="
                            text-2xl
                            font-black
                            text-[#252525]
                        "
                    >
                        تسجيل الدخول
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-7
                            text-[#6B6862]
                        "
                    >
                        سجل الدخول علشان تكمل طلبك وتتابع كل طلباتك بسهولة.
                    </p>

                </div>


                {error && (

                    <div
                        className="
                            mt-5
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>

                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        mt-7
                        space-y-5
                    "
                >

                    <Field
                        label="البريد الإلكتروني"
                        icon={Mail}
                    >

                        <input
                            required
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={
                                event =>
                                    setEmail(
                                        event.target.value
                                    )
                            }
                            className={
                                inputClass
                            }
                        />

                    </Field>


                    <Field
                        label="كلمة المرور"
                        icon={LockKeyhole}
                    >

                        <input
                            required
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={
                                event =>
                                    setPassword(
                                        event.target.value
                                    )
                            }
                            className={
                                inputClass
                            }
                        />

                    </Field>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            rounded-xl
                            bg-[#1F4E5F]
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-white
                            transition
                            hover:bg-[#173C49]
                            disabled:opacity-60
                        "
                    >
                        {
                            loading
                                ? "جاري تسجيل الدخول..."
                                : "تسجيل الدخول"
                        }
                    </button>

                </form>


                <div
                    className="
                        mt-6
                        border-t
                        border-[#E7E0D5]
                        pt-5
                        text-center
                        text-sm
                        text-[#6B6862]
                    "
                >
                    ليس لديك حساب؟{" "}

                    <Link
                        href="/account/register"
                        className="
                            font-bold
                            text-[#252525]
                        "
                    >
                        إنشاء حساب
                    </Link>
                </div>

            </div>

        </section>

    );

}


function Field({
    label,
    icon: Icon,
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
            </span>


            <div
                className="
                    flex
                    items-center
                    rounded-xl
                    border
                    border-[#D9D0C4]
                    px-3
                    focus-within:border-[#1F4E5F]
                "
            >

                <Icon
                    size={18}
                    className="
                        shrink-0
                        text-[#8A857D]
                    "
                />

                {children}

            </div>

        </label>

    );

}


const inputClass = `
    w-full
    bg-transparent
    px-3
    py-3
    text-sm
    outline-none
`;