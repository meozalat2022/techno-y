
"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Check,
    Gift,
    X,
} from "lucide-react";

import productService from
    "@/services/productService";


const formatCurrency =
    value =>
        new Intl.NumberFormat(
            "ar-EG",
            {
                style:
                    "currency",
                currency:
                    "EGP",
                maximumFractionDigits:
                    2,
            }
        ).format(
            Number(value) || 0
        );


// v3 intentionally invalidates the
// previous dismissal records.
//
// This prevents old test/session data from
// suppressing valid recommendations.
const DISMISSED_KEY =
    "technoy-dismissed-bundle-recommendations-v3";


const ANALYTICS_SESSION_KEY =
    "technoy-bundle-analytics-session-v1";

const APPLIED_BUNDLE_RECOMMENDATION_KEY =
    "technoy-applied-bundle-recommendation-v1";


const createCartFingerprint =
    items => {
        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return "";
        }

        return items
            .map(
                item =>
                    `${String(
                        item.productId
                    )}:${Number(
                        item.quantity
                    ) || 0}`
            )
            .sort()
            .join("|");
    };


const getDismissedRecommendations =
    () => {
        if (
            typeof window ===
            "undefined"
        ) {
            return [];
        }

        try {
            const saved =
                window.sessionStorage
                    .getItem(
                        DISMISSED_KEY
                    );

            if (!saved) {
                return [];
            }

            const parsed =
                JSON.parse(
                    saved
                );

            return Array.isArray(
                parsed
            )
                ? parsed
                : [];
        } catch {
            return [];
        }
    };


const saveDismissedRecommendation =
    (
        bundleId,
        cartFingerprint
    ) => {
        if (
            typeof window ===
            "undefined"
        ) {
            return;
        }

        if (!cartFingerprint) {
            return;
        }

        try {
            const dismissed =
                getDismissedRecommendations();

            const alreadyExists =
                dismissed.some(
                    entry =>
                        entry.bundleId ===
                        String(
                            bundleId
                        ) &&
                        entry.cartFingerprint ===
                        cartFingerprint
                );

            if (
                alreadyExists
            ) {
                return;
            }

            const nextDismissed = [
                ...dismissed,
                {
                    bundleId:
                        String(
                            bundleId
                        ),
                    cartFingerprint,
                },
            ];

            /*
             * Keep the session storage small.
             * The newest 20 dismissal records
             * are enough for this feature.
             */
            const limited =
                nextDismissed.slice(
                    -20
                );

            window.sessionStorage
                .setItem(
                    DISMISSED_KEY,
                    JSON.stringify(
                        limited
                    )
                );
        } catch {
            // Session storage is optional.
        }
    };


/*
 * Remove dismissal records that belong to
 * a previous cart state.
 *
 * This is important because a customer can:
 *
 * 1. See a recommendation
 * 2. Dismiss it
 * 3. Change the cart
 * 4. Become eligible for a recommendation again
 *
 * A dismissal from the previous cart state
 * must not affect the new cart state.
 */
const cleanDismissedRecommendationsForCart =
    cartFingerprint => {
        if (
            typeof window ===
            "undefined"
        ) {
            return;
        }

        try {
            const dismissed =
                getDismissedRecommendations();

            if (
                dismissed.length === 0
            ) {
                return;
            }

            const currentCartDismissals =
                dismissed.filter(
                    entry =>
                        entry.cartFingerprint ===
                        cartFingerprint
                );

            if (
                currentCartDismissals.length ===
                dismissed.length
            ) {
                return;
            }

            if (
                currentCartDismissals.length ===
                0
            ) {
                window.sessionStorage
                    .removeItem(
                        DISMISSED_KEY
                    );

                return;
            }

            window.sessionStorage
                .setItem(
                    DISMISSED_KEY,
                    JSON.stringify(
                        currentCartDismissals
                    )
                );
        } catch {
            // Session storage is optional.
        }
    };


const getAnalyticsSessionId =
    () => {
        if (
            typeof window ===
            "undefined"
        ) {
            return "";
        }

        try {
            const existing =
                window.localStorage
                    .getItem(
                        ANALYTICS_SESSION_KEY
                    );

            if (existing) {
                return existing;
            }

            const generated =
                typeof window.crypto?.randomUUID ===
                    "function"
                    ? window.crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`;

            window.localStorage.setItem(
                ANALYTICS_SESSION_KEY,
                generated
            );

            return generated;
        } catch {
            return "";
        }
    };

const saveAppliedBundleRecommendation =
    ({
        bundleId,
        recommendationType,
        sessionId,
        cartFingerprint,
    }) => {

        if (
            typeof window ===
            "undefined"
        ) {
            return;
        }

        try {

            const payload = {
                bundleId:
                    String(
                        bundleId
                    ),

                recommendationType,

                sessionId:
                    String(
                        sessionId || ""
                    ),

                cartFingerprint:
                    String(
                        cartFingerprint || ""
                    ),

                appliedAt:
                    new Date().toISOString(),
            };


            window.localStorage.setItem(
                APPLIED_BUNDLE_RECOMMENDATION_KEY,
                JSON.stringify(
                    payload
                )
            );

        } catch {
            // localStorage is optional.
        }
    };


const wasRecommendationDismissed =
    (
        bundleId,
        cartFingerprint
    ) => {
        if (!cartFingerprint) {
            return false;
        }

        return (
            getDismissedRecommendations()
                .some(
                    entry =>
                        entry.bundleId ===
                        String(
                            bundleId
                        ) &&
                        entry.cartFingerprint ===
                        cartFingerprint
                )
        );
    };


export default function BundleRecommendation({
    items,
    replaceItems,
}) {
    const [
        recommendation,
        setRecommendation,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        applying,
        setApplying,
    ] = useState(false);

    const requestId =
        useRef(0);


    useEffect(() => {
        if (
            !Array.isArray(items)
        ) {
            setRecommendation(
                null
            );

            return undefined;
        }

        if (
            items.length === 0
        ) {
            setRecommendation(
                null
            );

            /*
             * Empty cart means there is no
             * meaningful dismissal state.
             */
            try {
                if (
                    typeof window !==
                    "undefined"
                ) {
                    window.sessionStorage
                        .removeItem(
                            DISMISSED_KEY
                        );
                }
            } catch {
                // Session storage is optional.
            }

            return undefined;
        }


        const cartItems =
            items.map(
                item => ({
                    product:
                        item.productId,
                    quantity:
                        item.quantity,
                })
            );


        const cartFingerprint =
            createCartFingerprint(
                items
            );


        /*
         * Important:
         *
         * A dismissal belongs only to the
         * current cart state.
         *
         * If the customer changed the cart,
         * remove dismissals from previous cart
         * states before checking the new
         * recommendation.
         */
        cleanDismissedRecommendationsForCart(
            cartFingerprint
        );


        const currentRequestId =
            ++requestId.current;


        setLoading(
            true
        );


        setRecommendation(
            null
        );


        productService
            .getBundleRecommendation(
                cartItems
            )
            .then(
                response => {
                    if (
                        currentRequestId !==
                        requestId.current
                    ) {
                        return;
                    }


                    const nextRecommendation =
                        response?.data ||
                        null;


                    if (
                        !nextRecommendation
                            ?.bundle
                            ?._id
                    ) {
                        setRecommendation(
                            null
                        );

                        return;
                    }


                    const bundleId =
                        String(
                            nextRecommendation
                                .bundle
                                ._id
                        );


                    /*
                     * Only suppress the recommendation
                     * if this exact bundle was dismissed
                     * for this exact current cart state.
                     */
                    if (
                        wasRecommendationDismissed(
                            bundleId,
                            cartFingerprint
                        )
                    ) {
                        setRecommendation(
                            null
                        );

                        return;
                    }


                    setRecommendation(
                        nextRecommendation
                    );


                    /*
                     * Record that the recommendation
                     * was actually eligible to be shown.
                     *
                     * Analytics errors are intentionally
                     * ignored so they can never interfere
                     * with the customer's cart.
                     */
                    void productService
                        .trackBundleRecommendationEvent({
                            eventType:
                                "shown",

                            bundleId,

                            recommendationType:
                                nextRecommendation
                                    .type ===
                                    "partial"
                                    ? "partial"
                                    : "exact",

                            sessionId:
                                getAnalyticsSessionId(),

                            cartFingerprint,
                        })
                        .catch(() => {
                            // Analytics must never block the cart experience.
                        });
                }
            )
            .catch(() => {
                if (
                    currentRequestId ===
                    requestId.current
                ) {
                    setRecommendation(
                        null
                    );
                }
            })
            .finally(() => {
                if (
                    currentRequestId ===
                    requestId.current
                ) {
                    setLoading(
                        false
                    );
                }
            });


        return () => {
            /*
             * The request ID prevents an older
             * response from replacing a newer
             * cart state.
             */
        };
    }, [items]);


    if (
        loading ||
        !recommendation
    ) {
        return null;
    }


    const bundle =
        recommendation.bundle;


    const isPartial =
        recommendation.type ===
        "partial";


    const handleDismiss =
        () => {
            const cartFingerprint =
                createCartFingerprint(
                    items
                );


            saveDismissedRecommendation(
                String(
                    bundle._id
                ),
                cartFingerprint
            );


            setRecommendation(
                null
            );
        };


    const handleApply =
        () => {
            if (
                applying
            ) {
                return;
            }


            setApplying(
                true
            );


            const cartFingerprint =
                createCartFingerprint(
                    items
                );


            const analyticsSessionId =
                getAnalyticsSessionId();


            const recommendationType =
                isPartial
                    ? "partial"
                    : "exact";


            /*
             * Record acceptance before modifying
             * the cart.
             */
            void productService
                .trackBundleRecommendationEvent({
                    eventType:
                        "accepted",

                    bundleId:
                        String(
                            bundle._id
                        ),

                    recommendationType,

                    sessionId:
                        analyticsSessionId,

                    cartFingerprint,
                })
                .catch(() => {
                    // Analytics must never block bundle conversion.
                });


            /*
             * Persist the accepted recommendation
             * so checkout can associate the eventual
             * order with this recommendation.
             */
            saveAppliedBundleRecommendation({
                bundleId:
                    String(
                        bundle._id
                    ),

                recommendationType,

                sessionId:
                    analyticsSessionId,

                cartFingerprint,
            });


            try {
                const matchedMap =
                    new Map(
                        (
                            recommendation
                                .matchedItems ||
                            []
                        ).map(
                            item => [
                                String(
                                    item.productId
                                ),
                                Number(
                                    item.quantity
                                ) || 0,
                            ]
                        )
                    );


                const nextItems = [];


                for (
                    const item
                    of items
                ) {
                    const matchedQuantity =
                        matchedMap.get(
                            String(
                                item.productId
                            )
                        ) || 0;


                    if (
                        matchedQuantity <=
                        0
                    ) {
                        nextItems.push(
                            item
                        );

                        continue;
                    }


                    const remainingQuantity =
                        Number(
                            item.quantity
                        ) -
                        matchedQuantity;


                    if (
                        remainingQuantity >
                        0
                    ) {
                        nextItems.push({
                            ...item,

                            quantity:
                                remainingQuantity,
                        });
                    }
                }


                const existingBundle =
                    items.find(
                        item =>
                            String(
                                item.productId
                            ) ===
                            String(
                                bundle._id
                            )
                    );


                if (
                    !existingBundle
                ) {
                    nextItems.push({
                        productId:
                            bundle._id,

                        slug:
                            bundle.slug,

                        title:
                            bundle.title,

                        sku:
                            bundle.sku,

                        image:
                            bundle.images?.[0] ||
                            null,

                        brand:
                            bundle.brand?.name ||
                            "",

                        category:
                            bundle.category?.name ||
                            "",

                        regularPrice:
                            bundle.regularPrice,

                        salePrice:
                            bundle.salePrice,

                        stockQuantity:
                            bundle.stockQuantity,

                        quantity:
                            1,

                        isBundle:
                            true,
                    });
                }


                replaceItems(
                    nextItems
                );


                setRecommendation(
                    null
                );
            } finally {
                setApplying(
                    false
                );
            }
        };


    return (
        <div
            className="
                mt-4
                rounded-2xl
                border
                border-emerald-200
                bg-emerald-50
                p-4
            "
        >
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        flex
                        items-start
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
                            rounded-full
                            bg-emerald-100
                            text-emerald-700
                        "
                    >
                        <Gift
                            size={20}
                        />
                    </div>


                    <div>
                        <p
                            className="
                                text-sm
                                font-bold
                                text-emerald-900
                            "
                        >
                            {isPartial
                                ? "يمكنك توفير أكثر مع هذا الباندل"
                                : "يمكنك تحويل منتجاتك إلى باندل"}
                        </p>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-emerald-800
                            "
                        >
                            {bundle.title}
                        </p>
                    </div>
                </div>


                <button
                    type="button"
                    onClick={
                        handleDismiss
                    }
                    disabled={
                        applying
                    }
                    className="
                        rounded-full
                        p-1
                        text-emerald-700
                        transition
                        hover:bg-emerald-100
                        hover:text-emerald-900
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                    aria-label="إغلاق"
                >
                    <X
                        size={18}
                    />
                </button>
            </div>


            <div
                className="
                    mt-4
                    grid
                    gap-3
                    sm:grid-cols-2
                "
            >
                <div
                    className="
                        rounded-xl
                        bg-white
                        p-3
                    "
                >
                    <p
                        className="
                            text-xs
                            font-semibold
                            text-slate-500
                        "
                    >
                        السعر العادي
                    </p>

                    <p
                        className="
                            mt-1
                            text-base
                            font-bold
                            text-slate-700
                            line-through
                        "
                    >
                        {formatCurrency(
                            recommendation
                                .regularTotal
                        )}
                    </p>
                </div>


                <div
                    className="
                        rounded-xl
                        bg-white
                        p-3
                    "
                >
                    <p
                        className="
                            text-xs
                            font-semibold
                            text-slate-500
                        "
                    >
                        سعر الباندل
                    </p>

                    <p
                        className="
                            mt-1
                            text-base
                            font-black
                            text-emerald-700
                        "
                    >
                        {formatCurrency(
                            recommendation
                                .bundlePrice
                        )}
                    </p>
                </div>
            </div>


            <div
                className="
                    mt-3
                    rounded-xl
                    bg-emerald-100
                    px-4
                    py-3
                    text-center
                "
            >
                <p
                    className="
                        text-sm
                        font-bold
                        text-emerald-900
                    "
                >
                    وفر{" "}
                    {formatCurrency(
                        recommendation
                            .savings
                    )}
                    {" "}
                    (
                    {Number(
                        recommendation
                            .savingsPercentage
                    ).toFixed(2)}
                    %)
                </p>
            </div>


            {isPartial &&
                Array.isArray(
                    recommendation.missingItems
                ) &&
                recommendation
                    .missingItems
                    .length > 0 && (
                    <div
                        className="
                            mt-4
                            rounded-xl
                            bg-white
                            p-3
                        "
                    >
                        <p
                            className="
                                text-xs
                                font-bold
                                text-slate-700
                            "
                        >
                            المنتجات المطلوبة لإكمال الباندل:
                        </p>


                        <div
                            className="
                                mt-2
                                space-y-2
                            "
                        >
                            {recommendation
                                .missingItems
                                .map(
                                    item => (
                                        <div
                                            key={
                                                item.productId
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                                text-sm
                                            "
                                        >
                                            <span
                                                className="
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    item.title
                                                }
                                            </span>

                                            <span
                                                className="
                                                    shrink-0
                                                    font-bold
                                                    text-slate-900
                                                "
                                            >
                                                ×
                                                {
                                                    item.quantity
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                )}


            <div
                className="
                    mt-4
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                "
            >
                <button
                    type="button"
                    onClick={
                        handleApply
                    }
                    disabled={
                        applying
                    }
                    className="
                        inline-flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-emerald-600
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-emerald-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    <Check
                        size={17}
                    />

                    {applying
                        ? "جاري التطبيق..."
                        : "نعم، أريد الباندل"}
                </button>


                <button
                    type="button"
                    onClick={
                        handleDismiss
                    }
                    disabled={
                        applying
                    }
                    className="
                        rounded-xl
                        border
                        border-emerald-300
                        bg-white
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-emerald-800
                        transition
                        hover:bg-emerald-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    ليس الآن
                </button>
            </div>
        </div>
    );
}
