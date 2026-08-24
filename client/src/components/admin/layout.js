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


    if (checkingAuth) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-100
                "
            >
                Checking authentication...
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

            <AdminSidebar />


            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <AdminHeader />

                <main
                    className="
                        p-6
                    "
                >
                    {children}
                </main>

            </div>

        </div>

    );

}