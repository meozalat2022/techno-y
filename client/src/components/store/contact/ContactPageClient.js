"use client";


import {
    useState,
} from "react";

import {
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Share2,
} from "lucide-react";
import {
    FaFacebookF,
    FaInstagram,
    FaTiktok,
} from "react-icons/fa";



import contactService from
    "@/services/contactService";

import getApiErrorMessage from
    "@/utils/getApiErrorMessage";


const phoneNumbers = [

    "01557794410",

    "01149047944",

    "01149045481",

];


export default function ContactPageClient() {

    const [
        form,
        setForm,
    ] =
        useState({

            name: "",

            phone: "",

            email: "",

            subject: "",

            message: "",

            website: "",

        });


    const [
        submitting,
        setSubmitting,
    ] =
        useState(false);


    const [
        success,
        setSuccess,
    ] =
        useState("");


    const [
        error,
        setError,
    ] =
        useState("");


    const updateField =
        (
            field,
            value
        ) => {

            setForm(
                previous => ({

                    ...previous,

                    [field]:
                        value,

                })
            );

        };


    const handleSubmit =
        async event => {

            event.preventDefault();


            setSuccess("");

            setError("");


            const name =
                form.name.trim();

            const phone =
                form.phone.trim();

            const email =
                form.email.trim();

            const subject =
                form.subject.trim();

            const message =
                form.message.trim();


            if (!name) {

                setError(
                    "من فضلك أدخل الاسم."
                );

                return;

            }


            if (!phone) {

                setError(
                    "من فضلك أدخل رقم الهاتف."
                );

                return;

            }


            if (
                !/^01[0125][0-9]{8}$/
                    .test(phone)
            ) {

                setError(
                    "أدخل رقم موبايل مصري صحيح مكوّن من 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015."
                );

                return;

            }


            if (
                email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email)
            ) {

                setError(
                    "أدخل بريدًا إلكترونيًا صحيحًا."
                );

                return;

            }


            if (!subject) {

                setError(
                    "من فضلك أدخل موضوع الرسالة."
                );

                return;

            }


            if (!message) {

                setError(
                    "من فضلك اكتب رسالتك."
                );

                return;

            }


            setSubmitting(true);


            try {

                const response =
                    await contactService
                        .sendMessage(
                            form
                        );


                setSuccess(
                    response.message ||
                    "تم إرسال رسالتك بنجاح."
                );


                setForm({

                    name: "",

                    phone: "",

                    email: "",

                    subject: "",

                    message: "",

                    website: "",

                });


            } catch (error) {

                setError(
                    getApiErrorMessage(
                        error,
                        "تعذر إرسال الرسالة. حاول مرة أخرى."
                    )
                );

            } finally {

                setSubmitting(
                    false
                );

            }

        };


    return (

        <>

            <section
                className="
                    border-b
                    border-[#E7E0D5]
                    bg-[#FAF6EE]
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        py-12
                        sm:px-6
                        lg:px-8
                        lg:py-16
                    "
                >

                    <div
                        className="
                            max-w-2xl
                        "
                    >

                        <div
                            className="
                                text-sm
                                font-bold
                                text-[#6B6862]
                            "
                        >
                            تواصل معنا
                        </div>


                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-black
                                text-[#252525]
                                sm:text-4xl
                            "
                        >
                            محتاج مساعدة؟ إحنا هنا علشان نسهّل عليك
                        </h1>


                        <p
                            className="
                                mt-4
                                text-sm
                                leading-8
                                text-[#6B6862]
                            "
                        >
                            مش متأكد من القطعة المناسبة لجهازك؟ أو عندك استفسار عن طلبك؟ تواصل مع فريق تكنو-واي ونساعدك توصل للحل المناسب بأقل مجهود.
                        </p>

                    </div>

                </div>

            </section>


            <section
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-10
                    sm:px-6
                    lg:px-8
                "
            >

                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[360px_minmax(0,1fr)]
                        lg:items-start
                    "
                >

                    <div
                        className="
                            space-y-5
                        "
                    >

                        <ContactCard
                            icon={
                                Phone
                            }
                            title="اتصل بنا"
                        >

                            <div
                                className="
                                    space-y-2
                                "
                            >

                                {
                                    phoneNumbers
                                        .map(
                                            number => (

                                                <a
                                                    key={
                                                        number
                                                    }
                                                    href={
                                                        `tel:${number}`
                                                    }
                                                    dir="ltr"
                                                    className="
                                                        block
                                                        w-fit
                                                        font-semibold
                                                        text-[#3C3935]
                                                        hover:text-[#6B6862]
                                                    "
                                                >
                                                    {
                                                        number
                                                    }
                                                </a>

                                            )
                                        )
                                }

                            </div>

                        </ContactCard>


                        <ContactCard
                            icon={
                                MessageCircle
                            }
                            title="واتساب"
                        >

                            <div
                                className="
                                    space-y-2
                                "
                            >

                                {
                                    phoneNumbers
                                        .map(
                                            number => (

                                                <a
                                                    key={
                                                        number
                                                    }
                                                    href={
                                                        `https://wa.me/2${number}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    dir="ltr"
                                                    className="
                                                        block
                                                        w-fit
                                                        font-semibold
                                                        text-[#3C3935]
                                                        hover:text-[#6B6862]
                                                    "
                                                >
                                                    {
                                                        number
                                                    }
                                                </a>

                                            )
                                        )
                                }

                            </div>

                        </ContactCard>


                        <ContactCard
                            icon={Mail}
                            title="البريد الإلكتروني"
                        >

                            <a
                                href="mailto:zalat.dodo@gmail.com"
                                dir="ltr"
                                className="
                                    break-all
                                    font-semibold
                                    text-[#3C3935]
                                    hover:text-[#6B6862]
                                "
                            >
                                zalat.dodo@gmail.com
                            </a>

                        </ContactCard>


                        <ContactCard
                            icon={MapPin}
                            title="العنوان"
                        >

                            <p>
                                زهراء المعادي،
                                بيشتشو أمريكان سيتي،
                                المرحلة الثانية،
                                عمارة 12، أمام مرور
                                المعادي
                            </p>

                        </ContactCard>


                        <ContactCard
                            icon={Clock}
                            title="مواعيد العمل"
                        >

                            <p>
                                من السبت إلى الخميس
                            </p>

                            <p
                                className="
                                    mt-1
                                    font-semibold
                                    text-[#3C3935]
                                "
                            >
                                من 12 ظهرًا إلى
                                10 مساءً
                            </p>

                        </ContactCard>


                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#E7E0D5]
                                bg-[#FFFEFC]
                                p-5
                            "
                        >

                            <h2
                                className="
                                    font-black
                                    text-[#252525]
                                "
                            >
                                تابع تكنو-واي
                            </h2>


                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >

                                <SocialLink
                                    href="https://web.facebook.com/profile.php?id=61559577986793&mibextid=ZbWKwL&_rdc=1&_rdr#"
                                    icon={FaFacebookF}
                                    label="Facebook"
                                />

                                <SocialLink
                                    href="https://www.instagram.com/techno_y2024?igsi=OXVvdDZ5d2N3dGc="
                                    icon={FaInstagram}
                                    label="Instagram"
                                />

                                <SocialLink
                                    href="https://vm.tiktok.com/ZS9BeYTBfXbjC-KESJg/"
                                    icon={FaTiktok}
                                    label="TikTok"
                                />

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            rounded-3xl
                            border
                            border-[#E7E0D5]
                            bg-[#FFFEFC]
                            p-6
                            shadow-sm
                            sm:p-8
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-2xl
                                    font-black
                                    text-[#252525]
                                "
                            >
                                أرسل لنا رسالة
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-7
                                    text-[#6B6862]
                                "
                            >
                                اكتب استفسارك
                                وسنتواصل معك في أقرب
                                وقت ممكن.
                            </p>

                        </div>


                        {
                            success &&
                            (

                                <div
                                    className="
                                        mt-6
                                        rounded-xl
                                        border
                                        border-emerald-200
                                        bg-emerald-50
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-emerald-700
                                    "
                                >
                                    {success}
                                </div>

                            )
                        }


                        {
                            error &&
                            (

                                <div
                                    className="
                                        mt-6
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

                            )
                        }


                        <form
                            noValidate
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                mt-7
                                space-y-5
                            "
                        >

                            <div
                                className="
                                    hidden
                                "
                                aria-hidden="true"
                            >

                                <input
                                    type="text"
                                    tabIndex="-1"
                                    autoComplete="off"
                                    value={
                                        form.website
                                    }
                                    onChange={
                                        event =>
                                            updateField(
                                                "website",
                                                event
                                                    .target
                                                    .value
                                            )
                                    }
                                />

                            </div>


                            <div
                                className="
                                    grid
                                    gap-5
                                    sm:grid-cols-2
                                "
                            >

                                <Field
                                    label="الاسم"
                                >

                                    <input
                                        required
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            event =>
                                                updateField(
                                                    "name",
                                                    event
                                                        .target
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
                                >

                                    <input
                                        required
                                        type="tel"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            event =>
                                                updateField(
                                                    "phone",
                                                    event
                                                        .target
                                                        .value
                                                )
                                        }
                                        className={
                                            inputClass
                                        }
                                    />

                                </Field>

                            </div>


                            <Field
                                label="البريد الإلكتروني"
                                optional
                            >

                                <input
                                    type="email"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        event =>
                                            updateField(
                                                "email",
                                                event
                                                    .target
                                                    .value
                                            )
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </Field>


                            <Field
                                label="موضوع الرسالة"
                            >

                                <input
                                    required
                                    value={
                                        form.subject
                                    }
                                    onChange={
                                        event =>
                                            updateField(
                                                "subject",
                                                event
                                                    .target
                                                    .value
                                            )
                                    }
                                    placeholder="مثال: استفسار عن قطعة غيار"
                                    className={
                                        inputClass
                                    }
                                />

                            </Field>


                            <Field
                                label="الرسالة"
                            >

                                <textarea
                                    required
                                    rows="6"
                                    minLength="10"
                                    value={
                                        form.message
                                    }
                                    onChange={
                                        event =>
                                            updateField(
                                                "message",
                                                event
                                                    .target
                                                    .value
                                            )
                                    }
                                    placeholder="اكتب تفاصيل استفسارك..."
                                    className={`
                                        ${inputClass}
                                        resize-y
                                        leading-7
                                    `}
                                />

                            </Field>


                            <button
                                type="submit"
                                disabled={
                                    submitting
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#1F4E5F]
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    transition
                                    hover:bg-[#173C49]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    sm:w-auto
                                "
                            >

                                <Send
                                    size={17}
                                />


                                {
                                    submitting
                                        ? "جاري الإرسال..."
                                        : "إرسال الرسالة"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            </section>

        </>

    );

}


function ContactCard({
    icon: Icon,
    title,
    children,
}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FFFEFC]
                p-5
            "
        >

            <div
                className="
                    flex
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#F4EDE2]
                        text-[#6B6862]
                    "
                >
                    <Icon
                        size={19}
                    />
                </div>


                <div
                    className="
                        min-w-0
                    "
                >

                    <h2
                        className="
                            text-sm
                            font-black
                            text-[#252525]
                        "
                    >
                        {title}
                    </h2>


                    <div
                        className="
                            mt-2
                            text-sm
                            leading-7
                            text-[#6B6862]
                        "
                    >
                        {children}
                    </div>

                </div>

            </div>

        </div>

    );

}


function SocialLink({
    href,
    icon: Icon,
    label,
}) {

    return (

        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#E7E0D5]
                text-[#6B6862]
                transition
                hover:border-slate-400
                hover:bg-[#FAF6EE]
                hover:text-[#252525]
            "
        >
            <Icon size={18} />
        </a>

    );

}


function Field({
    label,
    optional = false,
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

                {
                    optional &&
                    (

                        <span
                            className="
                                mr-1
                                text-xs
                                font-normal
                                text-[#8A857D]
                            "
                        >
                            (اختياري)
                        </span>

                    )
                }

            </span>


            {children}

        </label>

    );

}


const inputClass = `
    w-full
    rounded-xl
    border
    border-[#D9D0C4]
    bg-[#FFFEFC]
    px-4
    py-3
    text-sm
    text-[#252525]
    outline-none
    transition
    focus:border-[#1F4E5F]
`;