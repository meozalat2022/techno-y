"use client";


import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Bell,
    CheckCheck,
    LogOut,
    Menu,
} from "lucide-react";

import {
    useRouter,
} from "next/navigation";

import authService from
    "@/services/authService";

import notificationService from
    "@/services/notificationService";

import ar from
    "@/locales/ar";


const formatDate = value => {

    if (!value) {
        return "";
    }


    return new Intl.DateTimeFormat(
        "ar-EG",
        {
            dateStyle: "short",
            timeStyle: "short",
        }
    ).format(
        new Date(value)
    );
};


const notificationIcon = type => {

    if (type === "ORDER_CREATED") {
        return "🛒";
    }


    if (type === "ORDER_CANCELLED") {
        return "❌";
    }


    if (
        type ===
        "CUSTOMER_RETURN_REQUESTED"
    ) {
        return "↩️";
    }


    return "🔔";
};


export default function AdminHeader({
    onMenuOpen,
}) {

    const router =
        useRouter();


    const [
        notifications,
        setNotifications,
    ] = useState([]);


    const [
        unreadCount,
        setUnreadCount,
    ] = useState(0);


    const [
        open,
        setOpen,
    ] = useState(false);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const panelRef =
        useRef(null);


    const loadNotifications =
        async () => {

            try {

                const [
                    notificationResponse,
                    countResponse,
                ] = await Promise.all([
                    notificationService
                        .getNotifications(30),
                    notificationService
                        .getUnreadCount(),
                ]);


                setNotifications(
                    notificationResponse?.data || []
                );

                setUnreadCount(
                    Number(
                        countResponse?.data?.count ||
                        0
                    )
                );

            } catch (error) {
                /*
                 * Notifications are supplemental UI.
                 * A temporary notification API failure
                 * must not disrupt the admin dashboard.
                 */
                console.error(
                    "Failed to load notifications:",
                    error
                );
            }
        };


    useEffect(() => {

        loadNotifications();


        const interval =
            setInterval(
                loadNotifications,
                20000
            );


        return () =>
            clearInterval(interval);

    }, []);


    useEffect(() => {

        const handleOutsideClick =
            event => {

                if (
                    panelRef.current &&
                    !panelRef.current.contains(
                        event.target
                    )
                ) {
                    setOpen(false);
                }
            };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () =>
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

    }, []);


    const handleLogout =
        async () => {

            try {

                await authService
                    .logout();

            } finally {

                router.push(
                    "/login"
                );
            }
        };


    const handleNotificationClick =
        async notification => {

            if (!notification.read) {

                try {

                    await notificationService
                        .markAsRead(
                            notification._id
                        );

                    setNotifications(
                        current =>
                            current.map(
                                item =>
                                    item._id ===
                                    notification._id
                                        ? {
                                            ...item,
                                            read: true,
                                        }
                                        : item
                            )
                    );

                    setUnreadCount(
                        current =>
                            Math.max(
                                current - 1,
                                0
                            )
                    );

                } catch (error) {
                    console.error(
                        "Failed to mark notification as read:",
                        error
                    );
                }
            }


            setOpen(false);


            if (notification.link) {
                router.push(
                    notification.link
                );
            }
        };


    const handleMarkAllRead =
        async () => {

            if (unreadCount === 0) {
                return;
            }


            setLoading(true);


            try {

                await notificationService
                    .markAllAsRead();


                setNotifications(
                    current =>
                        current.map(
                            item => ({
                                ...item,
                                read: true,
                            })
                        )
                );

                setUnreadCount(0);

            } catch (error) {
                console.error(
                    "Failed to mark notifications as read:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };


    return (
        <header
            className="
                sticky
                top-0
                z-30
                flex
                h-16
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white/95
                px-4
                backdrop-blur
                sm:px-6
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <button
                    type="button"
                    onClick={
                        onMenuOpen
                    }
                    aria-label={
                        ar.common.menu
                    }
                    className="
                        rounded-lg
                        border
                        border-slate-300
                        p-2
                        text-slate-700
                        hover:bg-slate-50
                        lg:hidden
                    "
                >
                    <Menu
                        size={19}
                    />
                </button>


                <div>
                    <h2
                        className="
                            font-semibold
                            text-slate-900
                        "
                    >
                        {
                            ar.admin
                                .administration
                        }
                    </h2>

                    <p
                        className="
                            hidden
                            text-xs
                            text-slate-400
                            sm:block
                        "
                    >
                        تكنو-واي
                    </p>
                </div>
            </div>


            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <div
                    ref={panelRef}
                    className="relative"
                >

                    <button
                        type="button"
                        onClick={() =>
                            setOpen(
                                current =>
                                    !current
                            )
                        }
                        aria-label="الإشعارات"
                        className="
                            relative
                            rounded-lg
                            border
                            border-slate-300
                            p-2
                            text-slate-700
                            transition
                            hover:bg-slate-50
                        "
                    >
                        <Bell
                            size={19}
                        />

                        {unreadCount > 0 && (
                            <span
                                className="
                                    absolute
                                    -right-1
                                    -top-1
                                    flex
                                    min-h-5
                                    min-w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-600
                                    px-1
                                    text-[10px]
                                    font-bold
                                    text-white
                                "
                            >
                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                            </span>
                        )}
                    </button>


                    {open && (
                        <div
                            className="
                                absolute
                                left-0
                                mt-2
                                w-[min(92vw,380px)]
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                shadow-xl
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-slate-200
                                    px-4
                                    py-3
                                "
                            >
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        الإشعارات
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        آخر التحديثات
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleMarkAllRead
                                    }
                                    disabled={
                                        loading ||
                                        unreadCount === 0
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <CheckCheck
                                        size={15}
                                    />
                                    تحديد الكل كمقروء
                                </button>
                            </div>


                            <div className="max-h-[420px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-10 text-center text-sm text-slate-400">
                                        لا توجد إشعارات.
                                    </div>
                                ) : (
                                    notifications.map(
                                        notification => (
                                            <button
                                                key={
                                                    notification._id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                                className={`block w-full border-b border-slate-100 px-4 py-3 text-right transition hover:bg-slate-50 ${
                                                    notification.read
                                                        ? "bg-white"
                                                        : "bg-blue-50/70"
                                                }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-0.5 text-lg">
                                                        {notificationIcon(
                                                            notification.type
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="font-semibold text-slate-900">
                                                                {notification.title}
                                                            </p>

                                                            {!notification.read && (
                                                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                                            )}
                                                        </div>

                                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                                            {notification.message}
                                                        </p>

                                                        <p className="mt-1 text-[11px] text-slate-400">
                                                            {formatDate(
                                                                notification.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>


                <button
                    type="button"
                    onClick={
                        handleLogout
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-300
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-50
                    "
                >
                    <LogOut
                        size={16}
                    />

                    <span
                        className="
                            hidden
                            sm:inline
                        "
                    >
                        {
                            ar.common.logout
                        }
                    </span>
                </button>
            </div>
        </header>
    );
}
