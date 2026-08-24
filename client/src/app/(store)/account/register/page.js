"use client";


import {
    useState,
} from "react";

import Link from "next/link";

import {
    useRouter,
} from "next/navigation";

import {
    LockKeyhole,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";

import {
    useAuth,
} from "@/context/AuthContext";


export default function RegisterPage() {

    const router =
        useRouter();


    const {
        register,
    } =
        useAuth();


    const [
        form,
        setForm,
    ] =
        useState({

            firstName: "",

            lastName: "",

            email: "",

            phone: "",

            password: "",

            confirmPassword: "",

        });


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


    const updateField =
        (
            field,
            value
        ) => {

            setForm(
                previous => ({
                    ...previous,
                    [field]: value,
                })
            );

        };


    const handleSubmit =
        async event => {

            event.preventDefault();

            setError("");


            if (
                form.password !==
                form.confirmPassword
            ) {

                setError(
                    "كلمتا المرور غير متطابقتين."
                );

                return;

            }


            if (
                form.password.length <
                6
            ) {

                setError(
                    "كلمة المرور يجب ألا تقل عن 6 أحرف."
                );

                return;

            }


            setLoading(true);


            try {

                await register({

                    firstName:
                        form.firstName
                            .trim(),

                    lastName:
                        form.lastName
                            .trim(),

                    email:
                        form.email
                            .trim(),

                    phone:
                        form.phone
                            .trim(),

                    password:
                        form.password,

                });


                router.push(
                    "/account"
                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    "تعذر إنشاء الحساب."

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
                    max-w-2xl
                    rounded-3xl
                    border
                    border-[#E7E0D5]
                    bg-[#FFFEFC]
                    p-6
                    shadow-sm
                    sm:p-8
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <h1
                        className="
                            text-2xl
                            font-black
                            text-[#252525]
                        "
                    >
                        إنشاء حساب
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-7
                            text-[#6B6862]
                        "
                    >
                        أنشئ حسابك مرة واحدة علشان الطلب والمتابعة يبقوا أسهل كل مرة.
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
                    "
                >

                    <div
                        className="
                            grid
                            gap-5
                            sm:grid-cols-2
                        "
                    >

                        <Field
                            label="الاسم الأول"
                            icon={UserRound}
                        >
                            <input
                                required
                                value={
                                    form.firstName
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "firstName",
                                            event.target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />
                        </Field>


                        <Field
                            label="اسم العائلة"
                            icon={UserRound}
                        >
                            <input
                                required
                                value={
                                    form.lastName
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "lastName",
                                            event.target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />
                        </Field>


                        <Field
                            label="البريد الإلكتروني"
                            icon={Mail}
                        >
                            <input
                                required
                                type="email"
                                autoComplete="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "email",
                                            event.target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />
                        </Field>


                        <Field
                            label="رقم الهاتف"
                            icon={Phone}
                        >
                            <input
                                required
                                type="tel"
                                autoComplete="tel"
                                value={
                                    form.phone
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "phone",
                                            event.target
                                                .value
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
                                autoComplete="new-password"
                                value={
                                    form.password
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "password",
                                            event.target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />
                        </Field>


                        <Field
                            label="تأكيد كلمة المرور"
                            icon={LockKeyhole}
                        >
                            <input
                                required
                                type="password"
                                autoComplete="new-password"
                                value={
                                    form.confirmPassword
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "confirmPassword",
                                            event.target
                                                .value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />
                        </Field>

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            mt-6
                            w-full
                            rounded-xl
                            bg-[#1F4E5F]
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-white
                            hover:bg-[#173C49]
                            disabled:opacity-60
                        "
                    >
                        {
                            loading
                                ? "جاري إنشاء الحساب..."
                                : "إنشاء الحساب"
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
                    لديك حساب بالفعل؟{" "}

                    <Link
                        href="/account/login"
                        className="
                            font-bold
                            text-[#252525]
                        "
                    >
                        تسجيل الدخول
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