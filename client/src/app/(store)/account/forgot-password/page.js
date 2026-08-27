"use client";

import {
    useState,
} from "react";

import Link from "next/link";
import {
    Mail,
} from "lucide-react";

import authService from
    "@/services/authService";

import getApiErrorMessage from
    "@/utils/getApiErrorMessage";

export default function ForgotPasswordPage() {
    const [
        email,
        setEmail,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const handleSubmit =
        async event => {
            event.preventDefault();

            setLoading(true);
            setError("");
            setMessage("");

            try {
                const response =
                    await authService
                        .forgotPassword(
                            email.trim()
                        );

                setMessage(
                    response.message ||
                    "إذا كان البريد الإلكتروني مسجلاً لدينا، ستصلك رسالة لإعادة تعيين كلمة المرور."
                );
            } catch (error) {
                setError(
                    getApiErrorMessage(
                        error,
                        "تعذر إرسال طلب إعادة تعيين كلمة المرور."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md rounded-3xl border border-[#E7E0D5] bg-[#FFFEFC] p-6 shadow-sm sm:p-8">
                <div
                    dir="rtl"
                    className="text-center"
                >
                    <h1 className="text-2xl font-black text-[#252525]">
                        نسيت كلمة المرور؟
                    </h1>

                    <p className="mt-2 text-sm leading-7 text-[#6B6862]">
                        أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة.
                    </p>
                </div>

                {error && (
                    <div
                        dir="rtl"
                        className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        dir="rtl"
                        className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-7 text-green-700"
                    >
                        {message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-5"
                    dir="rtl"
                >
                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-[#252525]">
                            البريد الإلكتروني
                        </span>

                        <div className="relative">
                            <Mail
                                size={19}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#77736C]"
                            />

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
                                className="w-full rounded-xl border border-[#DDD2C2] bg-white py-3 pl-4 pr-12 outline-none focus:border-[#1F4E5F]"
                            />
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#1F4E5F] px-5 py-3.5 font-bold text-white disabled:opacity-50"
                    >
                        {loading
                            ? "جاري الإرسال..."
                            : "إرسال رابط إعادة التعيين"}
                    </button>
                </form>

                <div
                    dir="rtl"
                    className="mt-6 text-center text-sm"
                >
                    <Link
                        href="/account/login"
                        className="font-bold text-[#1F4E5F] hover:underline"
                    >
                        العودة إلى تسجيل الدخول
                    </Link>
                </div>
            </div>
        </section>
    );
}
