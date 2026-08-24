import {
    Cairo,
} from "next/font/google";

import "./globals.css";


const cairo =
    Cairo({

        variable:
            "--font-cairo",

        subsets: [
            "arabic",
            "latin",
        ],

    });


export const metadata = {

    metadataBase:
        new URL(
            "https://techno-y.com"
        ),

    title: {

        default:
            "تكنو-واي | قطع غيار الأجهزة المنزلية",

        template:
            "%s | تكنو-واي",

    },

    description:
        "متجر تكنو-واي لقطع غيار الأجهزة المنزلية في مصر. قطع غيار الثلاجات والغسالات والتكييف والخلاطات والمكانس والميكروويف وغيرها.",

    applicationName:
        "تكنو-واي",

    authors: [
        {
            name:
                "Techno-Y",
        },
    ],

    creator:
        "Techno-Y",

    publisher:
        "Techno-Y",

    alternates: {

        canonical:
            "/",

    },

    openGraph: {

        type:
            "website",

        locale:
            "ar_EG",

        url:
            "https://techno-y.com",

        siteName:
            "تكنو-واي",

        title:
            "تكنو-واي | قطع غيار الأجهزة المنزلية",

        description:
            "متجر تكنو-واي لقطع غيار الأجهزة المنزلية في مصر.",

    },

    twitter: {

        card:
            "summary_large_image",

        title:
            "تكنو-واي | قطع غيار الأجهزة المنزلية",

        description:
            "متجر تكنو-واي لقطع غيار الأجهزة المنزلية في مصر.",

    },

    robots: {

        index:
            true,

        follow:
            true,

        googleBot: {

            index:
                true,

            follow:
                true,

            "max-image-preview":
                "large",

            "max-snippet":
                -1,

            "max-video-preview":
                -1,

        },

    },

};


export default function RootLayout({
    children,
}) {

    return (

        <html
            lang="ar"
            dir="rtl"
            className={
                cairo.variable
            }
        >

            <body>
                {children}
            </body>

        </html>

    );

}