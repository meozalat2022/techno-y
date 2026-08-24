"use client";


import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import AdminSidebar from
    "@/components/admin/AdminSidebar";

import AdminHeader from
    "@/components/admin/AdminHeader";

import authService from
    "@/services/authService";

import ar from
    "@/locales/ar";


export default function AdminLayout({
    children,
}) {

    const router =
        useRouter();


    const [
        checkingAuth,
        setCheckingAuth,
    ] =
        useState(true);


    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] =
        useState(false);


    useEffect(
        () => {

            const checkAuth =
                async () => {

                    try {

                        const response =
                            await authService
                                .getCurrentUser();


                        const user =
                            response.data;


                        if (
                            user.role !==
                            "admin"
                        ) {

                            router.replace(
                                "/login"
                            );

                            return;

                        }


                        setCheckingAuth(
                            false
                        );


                    } catch {

                        router.replace(
                            "/login"
                        );

                    }

                };


            checkAuth();

        },
        [router]
    );


    useEffect(
        () => {

            if (
                !mobileMenuOpen
            ) {
                return;
            }


            const originalOverflow =
                document.body.style
                    .overflow;


            document.body.style
                .overflow =
                "hidden";


            return () => {

                document.body.style
                    .overflow =
                    originalOverflow;

            };

        },
        [
            mobileMenuOpen,
        ]
    );


    if (checkingAuth) {

        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-100
                    px-4
                    text-center
                    text-sm
                    text-slate-500
                "
            >
                {
                    ar.common
                        .checkingAuthentication
                }
            </div>
        );

    }


    return (
        <div
            className="
                min-h-screen
                bg-slate-100
                lg:flex
            "
        >

            <AdminSidebar
                mobileOpen={
                    mobileMenuOpen
                }
                onClose={
                    () =>
                        setMobileMenuOpen(
                            false
                        )
                }
            />


            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <AdminHeader
                    onMenuOpen={
                        () =>
                            setMobileMenuOpen(
                                true
                            )
                    }
                />


                <main
                    className="
                        p-4
                        sm:p-5
                        lg:p-6
                    "
                >
                    {children}
                </main>

            </div>

        </div>
    );

}