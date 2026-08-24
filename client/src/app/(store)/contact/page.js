import ContactPageClient from
    "@/components/store/contact/ContactPageClient";


export const metadata = {

    title:
        "تواصل معنا",

    description:
        "تواصل مع تكنو-واي للاستفسار عن قطع غيار الأجهزة المنزلية، توافق القطع، الطلبات وخدمة العملاء.",

    alternates: {

        canonical:
            "/contact",

    },

    openGraph: {

        title:
            "تواصل معنا | تكنو-واي",

        description:
            "تواصل مع فريق تكنو-واي لخدمة العملاء والاستفسار عن قطع الغيار والطلبات.",

        url:
            "/contact",

        type:
            "website",

    },

};


export default function ContactPage() {

    return (
        <ContactPageClient />
    );

}