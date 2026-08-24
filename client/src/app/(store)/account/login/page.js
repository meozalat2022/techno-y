import {
    Suspense,
} from "react";

import CustomerLoginClient from
    "@/components/store/account/CustomerLoginClient";


export default function CustomerLoginPage() {

    return (

        <Suspense
            fallback={
                <LoginFallback />
            }
        >
            <CustomerLoginClient />
        </Suspense>

    );

}


function LoginFallback() {

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
                    border-slate-200
                    bg-white
                    p-8
                    text-center
                    text-sm
                    text-slate-500
                    shadow-sm
                "
            >
                جاري تحميل صفحة تسجيل الدخول...
            </div>

        </section>

    );

}