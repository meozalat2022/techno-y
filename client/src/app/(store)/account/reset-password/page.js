"use client";

import {
    Suspense,
    useState,
} from "react";

import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import authService from
    "@/services/authService";

import getApiErrorMessage from
    "@/utils/getApiErrorMessage";

function ResetPasswordContent() {
    const router =
        useRouter();

    const searchParams =
        useSearchParams();

    const token =
        searchParams.get("token") || "";

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
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
        success,
        setSuccess,
    ] = useState(false);

    const handleSubmit =
        async event => {
            event.preventDefault();

            setError("");

            if (!token) {
                setError(
                    "رابط إعادة تعيين كلمة المرور غير صالح."
                );
                return;
            }

            if (password.length < 8) {
                setError(
                    "كلمة المرور يجب ألا تقل عن 8 أحرف."
                );
                return;
            }

            if (
                password !==
                confirmPassword
            ) {
                setError(
                    "كلمتا المرور غير متطابقتين."
                );
                return;
            }

            setLoading(true);

            try {
                await authService
                    .resetPassword({
                        token,
                        password,
                    });

                setSuccess(true);

                setTimeout(() => {
                    router.push(
                        "/account/login"
                    );
                }, 1800);
            } catch (error) {
                setError(
                    getApiErrorMessage(
                        error,
                        "تعذر تغيير كلمة المرور."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div
                dir="rtl"
                className="mx-auto max-w-md rounded-3xl border border-[#E7E0D5] bg-[#FFFEFC] p-6 shadow-sm sm:p-8"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-black text-[#252525]">
                        تعيين كلمة مرور جديدة
                    </h1>

                    <p className="mt-2 text-sm leading-7 text-[#6B6862]">
                        اختر كلمة مرور جديدة لحسابك.
                    </p>
                </div>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm leading-7 text-green-700">
                        تم تغيير كلمة المرور بنجاح. سيتم تحويلك إلى تسجيل الدخول...
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-7 space-y-5"
                    >
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold">
                                كلمة المرور الجديدة
                            </span>

                            <input
                                required
                                minLength={8}
                                maxLength={128}
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={
                                    event =>
                                        setPassword(
                                            event.target.value
                                        )
                                }
                                className="w-full rounded-xl border border-[#DDD2C2] bg-white px-4 py-3 outline-none focus:border-[#1F4E5F]"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold">
                                تأكيد كلمة المرور
                            </span>

                            <input
                                required
                                minLength={8}
                                maxLength={128}
                                type="password"
                                autoComplete="new-password"
                                value={
                                    confirmPassword
                                }
                                onChange={
                                    event =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                }
                                className="w-full rounded-xl border border-[#DDD2C2] bg-white px-4 py-3 outline-none focus:border-[#1F4E5F]"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#1F4E5F] px-5 py-3.5 font-bold text-white disabled:opacity-50"
                        >
                            {loading
                                ? "جاري الحفظ..."
                                : "حفظ كلمة المرور الجديدة"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm">
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

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="py-16 text-center">
                    جاري التحميل...
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}
