import AdminLayoutClient from
    "@/components/admin/AdminLayoutClient";

export const metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export default function AdminLayout({
    children,
}) {
    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
