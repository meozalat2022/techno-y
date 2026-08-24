"use client";


import {
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    LockKeyhole,
    Mail,
} from "lucide-react";

import authService from
    "@/services/authService";

import ar from
    "@/locales/ar";


export default function LoginPage() {

    const router =
        useRouter();


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

                const response =
                    await authService.login({
                        email,
                        password,
                    });


                const user =
                    response.data;


                if (
                    user.role !==
                    "admin"
                ) {

                    await authService.logout();

                    setError(
                        ar.auth.adminRequired
                    );

                    return;

                }


                router.push(
                    "/admin/dashboard"
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.auth.loginFailed

                );

            } finally {

                setLoading(false);

            }

        };


    return (

        <main
            className="
                min-h-screen
                bg-slate-100
                flex
                items-center
                justify-center
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    bg-white
                    p-8
                    shadow-sm
                    border
                    border-slate-200
                "
            >

                <div className="mb-8">

                    <div
                        className="
                            mb-2
                            text-3xl
                            font-bold
                            text-slate-900
                        "
                    >
                        تكنو-واي
                    </div>

                    <h1
                        className="
                            text-lg
                            font-semibold
                            text-slate-700
                        "
                    >
                        {ar.auth.welcome}
                    </h1>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5"
                >

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                            "
                        >
                            {ar.auth.email}
                        </label>


                        <div
                            className="
                                flex
                                items-center
                                rounded-lg
                                border
                                border-slate-300
                                px-3
                                focus-within:border-slate-500
                            "
                        >

                            <Mail
                                size={18}
                                className="
                                    shrink-0
                                    text-slate-400
                                "
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={
                                    event =>
                                        setEmail(
                                            event.target.value
                                        )
                                }
                                required
                                autoComplete="email"
                                placeholder="admin@example.com"
                                className="
                                    w-full
                                    bg-transparent
                                    px-3
                                    py-3
                                    outline-none
                                "
                            />

                        </div>

                    </div>


                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                            "
                        >
                            {ar.auth.password}
                        </label>


                        <div
                            className="
                                flex
                                items-center
                                rounded-lg
                                border
                                border-slate-300
                                px-3
                                focus-within:border-slate-500
                            "
                        >

                            <LockKeyhole
                                size={18}
                                className="
                                    shrink-0
                                    text-slate-400
                                "
                            />

                            <input
                                type="password"
                                value={password}
                                onChange={
                                    event =>
                                        setPassword(
                                            event.target.value
                                        )
                                }
                                required
                                autoComplete="current-password"
                                className="
                                    w-full
                                    bg-transparent
                                    px-3
                                    py-3
                                    outline-none
                                "
                            />

                        </div>

                    </div>


                    {error && (

                        <div
                            className="
                                rounded-lg
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


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            rounded-lg
                            bg-slate-900
                            px-4
                            py-3
                            font-medium
                            text-white
                            transition
                            hover:bg-slate-800
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {
                            loading
                                ? ar.auth.signingIn
                                : ar.auth.login
                        }

                    </button>

                </form>

            </div>

        </main>

    );

}