"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, Coins, Gift, RefreshCw, WalletCards } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import loyaltyService from "@/services/loyaltyService";
import formatCurrency from "@/utils/formatCurrency";

const transactionLabels = {
    earn_pending: "نقاط معلقة من طلب",
    earn_available: "نقاط أصبحت متاحة",
    earn_cancelled: "إلغاء نقاط معلقة",
    redeem: "استخدام نقاط",
    redeem_restore: "استرجاع نقاط بعد إلغاء طلب",
    return_earn_reversal: "خصم نقاط بسبب مرتجع",
    return_redemption_restore: "استرجاع نقاط مستخدمة بسبب مرتجع",
    admin_adjustment: "تعديل رصيد النقاط",
};

export default function LoyaltyPage() {
    const { user, loading: authLoading } = useAuth();
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadData = useCallback(async () => {
        if (!user) return;
        setLoading(true); setError("");
        try {
            const [summaryResponse, transactionsResponse] = await Promise.all([
                loyaltyService.getMyLoyalty(),
                loyaltyService.getMyTransactions({ page, limit: 20 }),
            ]);
            setSummary(summaryResponse.data);
            setTransactions(transactionsResponse.data || []);
            setPagination(transactionsResponse.pagination || { page: 1, pages: 1 });
        } catch (error) {
            setError(error.response?.data?.message || "تعذر تحميل بيانات نقاطك.");
        } finally { setLoading(false); }
    }, [user, page]);

    useEffect(() => { if (user) loadData(); }, [user, loadData]);

    if (authLoading || !user) return <LoadingState />;

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/account" className="inline-flex items-center gap-2 text-sm font-bold text-[#6B6862] hover:text-[#252525]">
                <ArrowLeft size={16} className="rotate-180" /> العودة إلى حسابي
            </Link>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-sm font-semibold text-[#6B6862]">برنامج الولاء</div>
                    <h1 className="mt-1 text-3xl font-black text-[#252525]">نقاطي</h1>
                    <p className="mt-2 text-sm leading-7 text-[#6B6862]">اجمع نقاطًا مع طلباتك واستخدمها كخصم في مشترياتك القادمة.</p>
                </div>
                <button type="button" onClick={loadData} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#D9D0C4] bg-[#FFFEFC] px-4 py-2.5 text-sm font-bold text-[#56524D] disabled:opacity-50">
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> تحديث
                </button>
            </div>

            {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}

            {loading && !summary ? <LoadingState /> : summary && <>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <BalanceCard icon={Coins} label="النقاط المتاحة" value={summary.spendablePoints} hint="يمكن استخدامها الآن" />
                    <BalanceCard icon={Clock3} label="النقاط المعلقة" value={summary.pendingPoints} hint="تتاح بعد تسليم الطلب" />
                    <BalanceCard icon={WalletCards} label="قيمة الخصم المتاحة" value={formatCurrency(summary.availableCreditEgp)} hint="رصيدك الحالي للخصم" />
                </div>

                {Number(summary.availablePoints) < 0 && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-800">لا توجد نقاط متاحة للاستخدام حاليًا. سيتم احتساب النقاط الجديدة القادمة أولًا لتسوية رصيد مرتجعات سابق.</div>}

                <div className="mt-6 rounded-2xl border border-[#E7E0D5] bg-[#FAF6EE] p-5">
                    <div className="flex items-start gap-3"><Gift size={21} className="mt-0.5 shrink-0 text-[#1F4E5F]" /><div>
                        <h2 className="font-black text-[#252525]">كيف تعمل النقاط؟</h2>
                        <p className="mt-2 text-sm leading-7 text-[#6B6862]">كل <strong>{summary.rules?.egpPerEarnPoint} جنيه</strong> من قيمة المنتجات = نقطة واحدة. وكل <strong>{summary.rules?.pointsPerRedemptionEgp} نقاط</strong> = جنيه خصم. الحد الأدنى للاستخدام <strong>{summary.rules?.minimumRedemptionPoints} نقطة</strong>.</p>
                    </div></div>
                </div>
            </>}

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#E7E0D5] bg-[#FFFEFC]">
                <div className="border-b border-[#E7E0D5] px-5 py-4"><h2 className="font-black text-[#252525]">سجل النقاط</h2><p className="mt-1 text-xs text-[#6B6862]">جميع عمليات كسب واستخدام واسترجاع النقاط.</p></div>
                {!loading && transactions.length === 0 ? <div className="px-5 py-12 text-center text-sm text-[#6B6862]">لا توجد حركات نقاط حتى الآن.</div> : <div className="divide-y divide-[#EFE9E0]">{transactions.map(t => <TransactionRow key={t._id} transaction={t} />)}</div>}
            </div>

            {pagination.pages > 1 && <div className="mt-6 flex items-center justify-between gap-4"><span className="text-sm text-[#6B6862]">صفحة {pagination.page} من {pagination.pages}</span><div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage(p => Math.max(p-1,1))} className="rounded-lg border border-[#D9D0C4] px-4 py-2 text-sm font-bold disabled:opacity-40">السابق</button>
                <button type="button" disabled={page >= pagination.pages} onClick={() => setPage(p => p+1)} className="rounded-lg border border-[#D9D0C4] px-4 py-2 text-sm font-bold disabled:opacity-40">التالي</button>
            </div></div>}
        </section>
    );
}

function BalanceCard({ icon: Icon, label, value, hint }) {
    return <div className="rounded-2xl border border-[#E7E0D5] bg-[#FFFEFC] p-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EDE2] text-[#1F4E5F]"><Icon size={19}/></div><div className="mt-4 text-sm text-[#6B6862]">{label}</div><div className="mt-1 text-2xl font-black text-[#252525]">{value}</div><div className="mt-1 text-xs text-[#8A857D]">{hint}</div></div>;
}

function TransactionRow({ transaction }) {
    const availableDelta = Number(transaction.availableDelta || 0);
    const pendingDelta = Number(transaction.pendingDelta || 0);
    const mainDelta = availableDelta !== 0 ? availableDelta : pendingDelta;
    return <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-bold text-[#252525]">{transactionLabels[transaction.type] || "حركة نقاط"}</div><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#8A857D]">{transaction.orderNumber && <span dir="ltr" className="font-mono">{transaction.orderNumber}</span>}{transaction.returnNumber && <span dir="ltr" className="font-mono">{transaction.returnNumber}</span>}<span>{formatDate(transaction.createdAt)}</span></div></div><div dir="ltr" className={`text-lg font-black ${mainDelta>0 ? "text-[#3F7D58]" : mainDelta<0 ? "text-[#C94A45]" : "text-[#56524D]"}`}>{mainDelta>0?"+":""}{mainDelta} نقطة</div></div>;
}

function formatDate(value) { if (!value) return "—"; return new Intl.DateTimeFormat("ar-EG",{dateStyle:"medium"}).format(new Date(value)); }
function LoadingState() { return <div className="py-20 text-center text-sm text-[#6B6862]">جاري تحميل بيانات النقاط...</div>; }
