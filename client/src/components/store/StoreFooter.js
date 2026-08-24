import Link from "next/link";

import {
    Headphones,
    PackageCheck,
    ShieldCheck,
    Truck,
} from "lucide-react";


const storeLinks = [

    {
        label: "كل المنتجات",
        href: "/products",
    },

    {
        label: "الأقسام",
        href: "/#categories",
    },

    {
        label: "المنتجات المميزة",
        href: "/products?featured=true",
    },

];

const customerLinks = [

    {
        label: "حسابي",
        href: "/account",
    },

    {
        label: "طلباتي",
        href: "/account/orders",
    },

    {
        label: "سلة التسوق",
        href: "/cart",
    },

    {
        label: "تواصل معنا",
        href: "/contact",
    },

];


export default function StoreFooter() {

    return (
        <footer
            className="
                mt-16
                border-t
                border-[#E7E0D5]
                bg-[#1F4E5F]
                text-white
            "
        >

            <div
                className="
                    border-b
                    border-white/15
                "
            >

                <div
                    className="
                        mx-auto
                        grid
                        max-w-7xl
                        grid-cols-2
                        gap-5
                        px-4
                        py-7
                        sm:px-6
                        lg:grid-cols-4
                        lg:px-8
                    "
                >

                    <Benefit
                        icon={PackageCheck}
                        title="قطع غيار متخصصة"
                        text="اختيارات لأجهزة وماركات متعددة"
                    />

                    <Benefit
                        icon={ShieldCheck}
                        title="اختيار موثوق"
                        text="معلومات واضحة لمساعدتك في اختيار القطعة"
                    />

                    <Benefit
                        icon={Truck}
                        title="الشحن"
                        text="توصيل الطلبات لمختلف المحافظات"
                    />

                    <Benefit
                        icon={Headphones}
                        title="مساعدة قبل الشراء"
                        text="نساعدك في الوصول للقطعة المناسبة"
                    />

                </div>

            </div>


            <div
                className="
                    mx-auto
                    grid
                    max-w-7xl
                    gap-10
                    px-4
                    py-12
                    sm:px-6
                    md:grid-cols-2
                    lg:grid-cols-4
                    lg:px-8
                "
            >

                <div
                    className="
                        lg:col-span-2
                    "
                >

                    <Link
                        href="/"
                        className="
                            text-2xl
                            font-black
                        "
                    >
                        تكنو-واي
                    </Link>


                    <p
                        className="
                            mt-4
                            max-w-lg
                            text-sm
                            leading-7
                            text-white/65
                        "
                    >
                        بنساعدك توصل لقطعة الغيار المناسبة لجهازك بسهولة ووضوح، علشان جهازك يرجع يشتغل وراحة بيتك ترجع.
                    </p>


                    <div
                        className="
                            mt-5
                            inline-flex
                            rounded-full
                            border
                            border-white/25
                            px-4
                            py-2
                            text-xs
                            text-white/80
                        "
                    >
                        راحة بيتك 💛
                    </div>

                </div>


                <FooterColumn
                    title="المتجر"
                    links={
                        storeLinks
                    }
                />


                <FooterColumn
                    title="خدمة العملاء"
                    links={
                        customerLinks
                    }
                />

            </div>


            <div
                className="
                    border-t
                    border-white/15
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        max-w-7xl
                        flex-col
                        gap-2
                        px-4
                        py-5
                        text-xs
                        text-[#6B6862]
                        sm:px-6
                        md:flex-row
                        md:items-center
                        md:justify-between
                        lg:px-8
                    "
                >

                    <span>
                        © {new Date().getFullYear()} تكنو-واي.
                        جميع الحقوق محفوظة.
                    </span>


                    <span>
                        متجر قطع غيار الأجهزة
                        المنزلية
                    </span>

                </div>

            </div>

        </footer>
    );

}


function Benefit({
    icon: Icon,
    title,
    text,
}) {

    return (
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
                    bg-[#173C49]
                    text-white/90
                "
            >
                <Icon size={19} />
            </div>


            <div>

                <div
                    className="
                        text-sm
                        font-semibold
                        text-white
                    "
                >
                    {title}
                </div>


                <div
                    className="
                        mt-1
                        text-xs
                        leading-5
                        text-white/65
                    "
                >
                    {text}
                </div>

            </div>

        </div>
    );

}


function FooterColumn({
    title,
    links,
}) {

    return (
        <div>

            <h3
                className="
                    text-sm
                    font-bold
                    text-white
                "
            >
                {title}
            </h3>


            <div
                className="
                    mt-4
                    space-y-3
                "
            >

                {links.map(
                    link => (

                        <Link
                            key={
                                `${link.href}-${link.label}`
                            }
                            href={
                                link.href
                            }
                            className="
                                block
                                text-sm
                                text-white/65
                                transition
                                hover:text-white
                            "
                        >
                            {
                                link.label
                            }
                        </Link>

                    )
                )}

            </div>

        </div>
    );

}