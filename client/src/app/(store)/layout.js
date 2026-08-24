import StoreHeader from
    "@/components/store/StoreHeader";

import StoreFooter from
    "@/components/store/StoreFooter";

import {
    CartProvider,
} from "@/context/CartContext";

import {
    AuthProvider,
} from "@/context/AuthContext";


export default function StoreLayout({
    children,
}) {

    return (

        <AuthProvider>

            <CartProvider>

                <div
                    className="
                        flex
                        min-h-screen
                        flex-col
                        bg-white
                    "
                >

                    <StoreHeader />

                    <main className="flex-1">
                        {children}
                    </main>

                    <StoreFooter />

                </div>

            </CartProvider>

        </AuthProvider>

    );

}