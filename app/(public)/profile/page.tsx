"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAuthApi } from "@/hooks/useAuthApi";
import { apiClient } from "@/services/apiClient";
import { UserProfileResponse, TransactionItem } from "@/types/agaram.types";
import {
    Card, CardBody, CardHeader,
    Button, Input, Select, SelectItem,
    Chip, Avatar, Spinner, Progress,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Tooltip,
} from "@heroui/react";
import {
    LogOut, RefreshCcw, IndianRupee, CheckCircle2,
    Repeat, Zap, Search, Mail, Phone, MapPin,
    Copy, Check, Calendar,
    ChevronUp, ChevronDown, ChevronsUpDown, TrendingUp,
} from "lucide-react";
import { LuX } from "react-icons/lu";

const BRAND = "#00abc0";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
        : n >= 1000 ? `₹${(n / 1000).toFixed(0)}k`
            : `₹${n}`;

const fmtDate = (s?: string) => {
    if (!s) return "—";
    try { return new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return s; }
};

const getAmount = (tx: TransactionItem): number =>
    Number(tx.amount ?? tx.donationAmount ?? tx.totalAmount ?? tx.paymentAmount ?? 0);

const getCategory = (tx: TransactionItem): string => {
    const val = tx.paymentCategory ?? tx.donationCategory ?? tx.donationCategoryName ?? tx.categoryName
        ?? tx.purpose ?? tx.description ?? tx.category ?? tx.notes
        ?? tx.itemName ?? tx.programName ?? tx.title ?? tx.donationTitle
        ?? tx.itemDescription ?? tx.programCategory;
    return val ? String(val) : "—";
};

const getMethod = (tx: TransactionItem): string => {
    const val = tx.paymentMethod ?? tx.paymentMode ?? tx.method
        ?? tx.mode ?? tx.instrument ?? tx.paymentType ?? tx.type
        ?? tx.paymentInstrument ?? tx.channel;
    return val ? String(val) : "—";
};

const isSuccess = (tx: TransactionItem) =>
    ["captured", "success", "completed", "paid"].includes((tx.paymentStatus || "").toLowerCase());

const isFailed = (tx: TransactionItem) =>
    ["failed", "cancelled", "refunded"].includes((tx.paymentStatus || "").toLowerCase());

// --- Recurring detection based on known donation category/amount combinations ---
// Definitive recurring: Maadham 300 (only in monthly tab)
// Definitive one-time: Full Course, Corpus, Collective Impact, Learning & Development
// Individual Sponsorship: monthly=₹5000/₹8500, one-time=₹60000/₹100000 (no overlap)
// Academic Support – General Contribution: monthly=₹500/₹1000/₹3000, one-time=₹5000/₹7000
//   ⚠️ ₹2000 conflicts both tabs — resolved by pattern: 5+ consecutive months → recurring
const RECURRING_MONTH_THRESHOLD = 5;
const ONETIME_ONLY_KEYWORDS = ["full course", "corpus", "collective impact", "learning & development"];
const RECURRING_SPONSORSHIP_AMOUNTS = new Set([5000, 8500]);
const ONETIME_SPONSORSHIP_AMOUNTS = new Set([60000, 100000]);
const RECURRING_ACADEMIC_AMOUNTS = new Set([500, 1000, 3000]);
const ONETIME_ACADEMIC_AMOUNTS = new Set([5000, 7000]);

// Returns a Set of "category|amount" keys where the same pair appears in
// RECURRING_MONTH_THRESHOLD+ consecutive calendar months — resolves ambiguous cases.
function buildRecurringSignatures(txs: TransactionItem[]): Set<string> {
    const monthMap = new Map<string, Set<number>>();
    txs.forEach(tx => {
        const cat = getCategory(tx).toLowerCase();
        const amount = getAmount(tx);
        const date = tx.paymentDate ? new Date(tx.paymentDate) : null;
        if (!date || isNaN(date.getTime())) return;
        const key = `${cat}|${amount}`;
        const monthIndex = date.getFullYear() * 12 + date.getMonth();
        if (!monthMap.has(key)) monthMap.set(key, new Set());
        monthMap.get(key)!.add(monthIndex);
    });
    const result = new Set<string>();
    monthMap.forEach((months, key) => {
        const sorted = [...months].sort((a, b) => a - b);
        let streak = 1;
        for (let i = 1; i < sorted.length; i++) {
            streak = sorted[i] === sorted[i - 1] + 1 ? streak + 1 : 1;
            if (streak >= RECURRING_MONTH_THRESHOLD) { result.add(key); break; }
        }
    });
    return result;
}

const isRecurring = (tx: TransactionItem, recurringKeys = new Set<string>()): boolean => {
    const cat = getCategory(tx).toLowerCase();
    const amount = getAmount(tx);
    const x = tx as Record<string, unknown>;

    // API-level flags (future-proof)
    if (x.subscriptionId || x.isRecurring || x.paymentType === "recurring") return true;

    // Definitive one-time — bail early
    if (ONETIME_ONLY_KEYWORDS.some(k => cat.includes(k))) return false;

    // Definitive recurring by category name
    if (cat.includes("maadham") || cat.includes("மாதம்") || cat.includes("monthly") || cat.includes("recurring")) return true;

    // Individual Sponsorship — disambiguate by amount then pattern
    if (cat.includes("arts and humanities") || cat.includes("professional course")) {
        if (RECURRING_SPONSORSHIP_AMOUNTS.has(amount)) return true;
        if (ONETIME_SPONSORSHIP_AMOUNTS.has(amount)) return false;
        return recurringKeys.has(`${cat}|${amount}`);
    }

    // Academic Support — disambiguate by amount; ₹2000 falls through to pattern check
    if (cat.includes("academic support")) {
        if (RECURRING_ACADEMIC_AMOUNTS.has(amount)) return true;
        if (ONETIME_ACADEMIC_AMOUNTS.has(amount)) return false;
        return recurringKeys.has(`${cat}|${amount}`);
    }

    return false;
};

// --- Donor psychology insight computations (all from existing API data) ---

// Streak: consecutive calendar months (going back from now) with ≥1 successful payment
function computeStreak(txs: TransactionItem[]): number {
    const months = new Set<number>();
    txs.filter(isSuccess).forEach(tx => {
        const d = new Date(tx.paymentDate || "");
        if (!isNaN(d.getTime())) months.add(d.getFullYear() * 12 + d.getMonth());
    });
    const now = new Date();
    let idx = now.getFullYear() * 12 + now.getMonth();
    let streak = 0;
    while (months.has(idx)) { streak++; idx--; }
    return streak;
}

// Member since: earliest successful payment, formatted as "Aug 2025"
function computeMemberSince(txs: TransactionItem[]): string {
    const times = txs.filter(isSuccess)
        .map(tx => tx.paymentDate ? new Date(tx.paymentDate).getTime() : NaN)
        .filter(t => !isNaN(t));
    if (!times.length) return "";
    return new Date(Math.min(...times)).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

// Consistency: how many distinct months donated vs total months since first donation
function computeConsistency(txs: TransactionItem[]): { active: number; total: number } {
    const successDates = txs.filter(isSuccess)
        .map(tx => tx.paymentDate ? new Date(tx.paymentDate) : null)
        .filter(Boolean) as Date[];
    if (!successDates.length) return { active: 0, total: 0 };
    const earliest = new Date(Math.min(...successDates.map(d => d.getTime())));
    const now = new Date();
    const total = (now.getFullYear() - earliest.getFullYear()) * 12 + (now.getMonth() - earliest.getMonth()) + 1;
    const months = new Set(successDates.map(d => d.getFullYear() * 12 + d.getMonth()));
    return { active: months.size, total };
}

// This calendar year's successful donations
function computeThisYearDonated(txs: TransactionItem[]): number {
    const year = new Date().getFullYear();
    return txs.filter(isSuccess).reduce((s, tx) => {
        const d = new Date(tx.paymentDate || "");
        return !isNaN(d.getTime()) && d.getFullYear() === year ? s + getAmount(tx) : s;
    }, 0);
}

// Milestone: next giving milestone and % progress toward it
const MILESTONES = [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
function computeMilestone(total: number): { prev: number; target: number; pct: number } {
    const idx = MILESTONES.findIndex(m => m > total);
    const target = idx >= 0 ? MILESTONES[idx] : MILESTONES[MILESTONES.length - 1];
    const prev = idx > 0 ? MILESTONES[idx - 1] : 0;
    const pct = prev === target ? 100 : Math.round(((total - prev) / (target - prev)) * 100);
    return { prev, target, pct };
}

function findTransactions(obj: unknown, depth = 5): TransactionItem[] {
    if (depth <= 0 || !obj || typeof obj !== "object") return [];
    if (Array.isArray(obj)) {
        if (obj.length > 0 && isTxLike(obj[0])) return obj as TransactionItem[];
        for (const item of obj) { const r = findTransactions(item, depth - 1); if (r.length) return r; }
        return [];
    }
    const rec = obj as Record<string, unknown>;
    for (const key of Object.keys(rec)) {
        const v = rec[key];
        if (Array.isArray(v) && v.length > 0 && isTxLike(v[0])) return v as TransactionItem[];
        if (v && typeof v === "object") { const r = findTransactions(v, depth - 1); if (r.length) return r; }
    }
    return [];
}

function isTxLike(x: unknown): boolean {
    if (!x || typeof x !== "object") return false;
    const o = x as Record<string, unknown>;
    return "amount" in o || "transactionId" in o || "paymentDate" in o || "orderId" in o || "donationAmount" in o;
}

function buildMonthlyData(txs: TransactionItem[]) {
    const map: Record<string, { month: string; donated: number; count: number }> = {};
    txs.forEach(tx => {
        const date = tx.paymentDate ? new Date(tx.paymentDate) : null;
        if (!date || isNaN(date.getTime())) return;
        const key = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
        if (!map[key]) map[key] = { month: key, donated: 0, count: 0 };
        if (isSuccess(tx)) { map[key].donated += getAmount(tx); map[key].count += 1; }
    });
    return Object.values(map).slice(-12);
}

type SortKey = "date" | "amount" | "status" | "category";
type SortDir = "asc" | "desc";

function DonutChart({ successCount, failedCount, total }: { successCount: number; failedCount: number; total: number }) {
    const r = 48, cx = 60, cy = 60;
    const circumference = 2 * Math.PI * r;
    if (total === 0) return (
        <div className="flex flex-col items-center justify-center gap-2 text-default-300 h-36">
            <CheckCircle2 size={28} strokeWidth={1} /><p className="text-xs">No data yet</p>
        </div>
    );
    const successDash = (successCount / total) * circumference;
    const failedDash = (failedCount / total) * circumference;
    const successRate = Math.round((successCount / total) * 100);
    return (
        <svg viewBox="0 0 120 120" className="w-36 h-36">
            <g transform="rotate(-90 60 60)">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e4e4e7" strokeWidth="13" />
                {successDash > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke={BRAND} strokeWidth="13"
                    strokeDasharray={`${successDash} ${circumference - successDash}`} strokeLinecap="butt" />}
                {failedDash > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#dc2626" strokeWidth="13"
                    strokeDasharray={`${failedDash} ${circumference - failedDash}`}
                    strokeDashoffset={circumference - successDash} strokeLinecap="butt" />}
            </g>
            <text x={cx} y={cy - 5} textAnchor="middle" fontSize="20" fontWeight="700" fill="#132644" fontFamily="sans-serif">{successRate}%</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#71717a" fontFamily="sans-serif" letterSpacing="1">SUCCESS</text>
        </svg>
    );
}

function BarChart({ data, color = BRAND }: { data: { month: string; donated: number }[]; color?: string }) {
    if (!data.length) return (
        <div className="h-44 flex flex-col items-center justify-center gap-2 text-default-300">
            <IndianRupee size={28} strokeWidth={1} /><p className="text-sm">No data yet</p>
        </div>
    );
    const PX = 36, PY = 8, PB = 24, W = 400, H = 160;
    const chartW = W - PX, chartH = H - PY - PB;
    const max = Math.max(...data.map(d => d.donated), 1);
    const barW = Math.max(8, (chartW / data.length) * 0.5);
    const gridLines = [0, 1, 2, 3, 4].map(i => (i * max) / 4);
    const gradId = `bg${color.replace("#", "")}`;
    return (
        <svg viewBox={`0 0 ${W} ${H + PY}`} className="w-full h-44" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} /><stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
            </defs>
            {gridLines.map((v, i) => {
                const y = PY + chartH - (v / max) * chartH;
                return <g key={i}>
                    <line x1={PX} y1={y} x2={W} y2={y} stroke="#e4e4e7" strokeWidth="1" />
                    <text x={PX - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#a1a1aa">{fmtShort(v)}</text>
                </g>;
            })}
            {data.map((d, i) => {
                const slotW = chartW / data.length;
                const x = PX + i * slotW + slotW / 2 - barW / 2;
                const barH = (d.donated / max) * chartH;
                const y = PY + chartH - barH;
                return <g key={i}>
                    <rect x={x - 2} y={PY} width={barW + 4} height={chartH} fill="transparent" />
                    <rect x={x} y={y} width={barW} height={barH} rx="3" fill={`url(#${gradId})`} />
                    <title>{d.month}: {fmt(d.donated)}</title>
                    <text x={x + barW / 2} y={PY + chartH + 14} textAnchor="middle" fontSize="9" fill="#a1a1aa">{d.month}</text>
                </g>;
            })}
            <line x1={PX} y1={PY + chartH} x2={W} y2={PY + chartH} stroke="#e4e4e7" strokeWidth="1" />
        </svg>
    );
}

function LineChart({ data }: { data: { month: string; count: number; donated: number }[] }) {
    if (!data.length) return (
        <div className="h-40 flex flex-col items-center justify-center gap-2 text-default-300">
            <TrendingUp size={28} strokeWidth={1} /><p className="text-sm">No trend data yet</p>
        </div>
    );
    const PX = 28, PY = 22, PB = 24, W = 500, H = 130;
    const chartW = W - PX, chartH = H - PY - PB;
    const max = Math.max(...data.map(d => d.count), 1);
    const pts = data.map((d, i) => ({
        x: PX + (i / (data.length - 1 || 1)) * chartW,
        y: PY + chartH - (d.count / max) * chartH,
        d,
    }));
    const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaD = `M ${pts[0].x} ${PY + chartH} ${pts.map(p => `L ${p.x} ${p.y}`).join(" ")} L ${pts[pts.length - 1].x} ${PY + chartH} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H + PY}`} className="w-full h-40" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity="0.18" /><stop offset="100%" stopColor={BRAND} stopOpacity="0" />
                </linearGradient>
            </defs>
            {[0, 0.5, 1].map((v, i) => (
                <line key={i} x1={PX} y1={PY + chartH * (1 - v)} x2={W} y2={PY + chartH * (1 - v)} stroke="#e4e4e7" strokeWidth="1" />
            ))}
            <path d={areaD} fill="url(#areaGrad)" />
            <path d={pathD} fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <g key={i}>
                    {p.d.donated > 0 && (
                        <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="8" fill="#71717a" fontFamily="sans-serif">
                            {fmtShort(p.d.donated)}
                        </text>
                    )}
                    <circle cx={p.x} cy={p.y} r="3.5" fill={BRAND} stroke="white" strokeWidth="1.5" />
                    <title>{p.d.month}: {p.d.count} payments · {fmt(p.d.donated)}</title>
                    {data.length <= 10 && (
                        <text x={p.x} y={PY + chartH + 14} textAnchor="middle" fontSize="8.5" fill="#a1a1aa">{p.d.month}</text>
                    )}
                </g>
            ))}
            <line x1={PX} y1={PY + chartH} x2={W} y2={PY + chartH} stroke="#e4e4e7" strokeWidth="1" />
        </svg>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const { auth, logout, isLoading: authLoading } = useAuth();
    const authFetch = useAuthApi();

    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [copied, setCopied] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (authLoading) return;
        if (!auth.accessToken || !auth.userId) { router.replace("/login"); return; }
        setLoading(true);
        try {
            const profile = await authFetch(t => apiClient.getUserProfile(auth.userId!, t));
            setUserProfile(profile);
            try {
                const txRes = await authFetch(t => apiClient.getTransactions({
                    paymentListRequest: { userId: auth.userId!, pageIndex: 1, pageSize: 200, sortingColumnId: 0, sortingTypeId: 1 },
                }, t));
                setTransactions(findTransactions(txRes));
            } catch { /* tx optional */ }
        } catch { /* silently */ }
        finally { setLoading(false); }
    }, [auth.accessToken, auth.userId, authLoading, authFetch, router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const recurringSignatures = useMemo(() => buildRecurringSignatures(transactions), [transactions]);
    const recurring = (tx: TransactionItem) => isRecurring(tx, recurringSignatures);

    const stats = useMemo(() => {
        let totalDonated = 0, successCount = 0, failedCount = 0, recurringCount = 0;
        transactions.forEach(tx => {
            if (isSuccess(tx)) { totalDonated += getAmount(tx); successCount++; }
            if (isFailed(tx)) failedCount++;
            if (isRecurring(tx, recurringSignatures)) recurringCount++;
        });
        return { totalDonated, successCount, failedCount, recurringCount, oneTimeCount: transactions.length - recurringCount };
    }, [transactions, recurringSignatures]);

    const monthlyData = useMemo(() => buildMonthlyData(transactions), [transactions]);
    const streak = useMemo(() => computeStreak(transactions), [transactions]);
    const memberSince = useMemo(() => computeMemberSince(transactions), [transactions]);
    const consistency = useMemo(() => computeConsistency(transactions), [transactions]);
    const thisYearDonated = useMemo(() => computeThisYearDonated(transactions), [transactions]);
    const milestone = useMemo(() => computeMilestone(stats.totalDonated), [stats.totalDonated]);

    const categoryData = useMemo(() => {
        const map: Record<string, number> = {};
        transactions.filter(isSuccess).forEach(tx => {
            const cat = getCategory(tx);
            if (cat === "—") return;
            map[cat] = (map[cat] || 0) + getAmount(tx);
        });
        const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
        const total = sorted.reduce((s, [, v]) => s + v, 0);
        return sorted.slice(0, 6).map(([name, value]) => ({
            name, value, pct: total > 0 ? Math.round((value / total) * 100) : 0,
        }));
    }, [transactions]);

    const initials = useMemo(() => {
        const name = userProfile?.fullName || "";
        return name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
    }, [userProfile]);

    const filtered = useMemo(() => {
        let list = [...transactions];
        if (filterType === "recurring") list = list.filter(recurring);
        if (filterType === "onetime") list = list.filter(tx => !recurring(tx));
        if (filterStatus === "success") list = list.filter(isSuccess);
        if (filterStatus === "failed") list = list.filter(isFailed);
        if (filterStatus === "pending") list = list.filter(tx => !isSuccess(tx) && !isFailed(tx));
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(tx =>
                (tx.transactionId || "").toLowerCase().includes(q) ||
                (tx.orderId || "").toLowerCase().includes(q) ||
                getCategory(tx).toLowerCase().includes(q) ||
                getMethod(tx).toLowerCase().includes(q)
            );
        }
        list.sort((a, b) => {
            let diff = 0;
            if (sortKey === "date") diff = new Date(a.paymentDate || 0).getTime() - new Date(b.paymentDate || 0).getTime();
            if (sortKey === "amount") diff = getAmount(a) - getAmount(b);
            if (sortKey === "status") diff = (a.paymentStatus || "").localeCompare(b.paymentStatus || "");
            if (sortKey === "category") diff = getCategory(a).localeCompare(getCategory(b));
            return sortDir === "asc" ? diff : -diff;
        });
        return list;
    }, [transactions, recurringSignatures, search, filterType, filterStatus, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("desc"); }
    };

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text).then(() => { setCopied(text); setTimeout(() => setCopied(null), 1500); });
    };

    const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";
    const totalTx = transactions.length;
    const successRate = totalTx > 0 ? Math.round((stats.successCount / totalTx) * 100) : 0;
    const failedRate = totalTx > 0 ? Math.round((stats.failedCount / totalTx) * 100) : 0;
    const recurringRate = totalTx > 0 ? Math.round((stats.recurringCount / totalTx) * 100) : 0;
    const oneTimeRate = totalTx > 0 ? Math.round((stats.oneTimeCount / totalTx) * 100) : 0;

    if (authLoading || (loading && !userProfile)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-default-50">
                <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" color="primary" />
                    <p className="text-sm text-default-400">Loading your dashboard…</p>
                </div>
            </div>
        );
    }

    const SortIcon = ({ k }: { k: SortKey }) =>
        sortKey !== k ? <ChevronsUpDown size={12} className="text-default-400" />
            : sortDir === "asc" ? <ChevronUp size={12} className="text-primary" />
                : <ChevronDown size={12} className="text-primary" />;

    return (
        <div className="min-h-screen bg-default-50">
            <div className="sticky top-0 z-20 border-b border-divider bg-background/80 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <Avatar name={initials} size="sm" classNames={{ base: "bg-primary text-white font-bold shrink-0" }} />
                        <span className="text-sm font-bold">{userProfile?.fullName || "Profile"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="bordered" onPress={fetchData} isLoading={loading}
                            startContent={!loading && <RefreshCcw size={13} />}>Refresh</Button>
                        <Button size="sm" color="danger" variant="flat" onPress={logout}
                            startContent={<LogOut size={13} />}>Log out</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Profile Hero */}
                <Card shadow="none" className="border border-divider">
                    <CardBody className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                            <Avatar name={initials}
                                classNames={{ base: "w-24 h-24 text-3xl bg-primary text-white font-bold shrink-0" }} />
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-3">
                                    <Chip size="sm" variant="flat" color="primary" className="text-xs font-semibold">{greeting}</Chip>
                                    {streak > 0 && (
                                        <Chip size="sm" variant="flat" className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                            ✨ {streak} - Month Momentum
                                        </Chip>
                                    )}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{userProfile?.fullName || "—"}</h1>
                                <div className="flex flex-col sm:flex-row flex-wrap gap-y-2 gap-x-5 mt-3 items-center sm:items-start">
                                    {userProfile?.email && (
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-default-600">
                                            <Mail size={14} className="shrink-0" style={{ color: BRAND }} />{userProfile.email}
                                        </span>
                                    )}
                                    {userProfile?.phoneNumber && (
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-default-600">
                                            <Phone size={14} className="shrink-0" style={{ color: BRAND }} />{userProfile.phoneNumber}
                                        </span>
                                    )}
                                    {userProfile?.address && (
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-default-600">
                                            <MapPin size={14} className="shrink-0" style={{ color: BRAND }} />{userProfile.address}
                                        </span>
                                    )}
                                    {memberSince && (
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-default-600">
                                            <Calendar size={14} className="shrink-0" style={{ color: BRAND }} />Supporting since {memberSince}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {stats.successCount > 0 && (
                                <div className="w-full sm:w-auto sm:shrink-0 text-center border-2 border-primary/20 rounded-2xl px-6 py-4 bg-primary/5">
                                    <p className="text-[11px] text-default-500 uppercase tracking-widest font-bold">Total Impact</p>
                                    <p className="text-2xl font-extrabold mt-1 tracking-tight" style={{ color: BRAND }}>{fmt(stats.totalDonated)}</p>
                                    <p className="text-xs font-medium text-default-500 mt-1">{stats.successCount} Contributions Made</p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card shadow="none" className="border border-divider">
                        <CardBody className="p-4 sm:p-5 gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-default-500 uppercase tracking-wider">Total Donated</p>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0" style={{ color: BRAND }}>
                                    <IndianRupee size={18} />
                                </div>
                            </div>
                            <p className="text-xl sm:text-2xl font-extrabold tracking-tight">{fmt(stats.totalDonated)}</p>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-default-500">{stats.successCount} Contributions</span>
                                    <span className="text-xs font-bold" style={{ color: BRAND }}>{successRate}%</span>
                                </div>
                                <Progress value={successRate} color="primary" size="sm" aria-label="Success rate" />
                            </div>
                        </CardBody>
                    </Card>
                    <Card shadow="none" className="border border-divider">
                        <CardBody className="p-4 sm:p-5 gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-default-500 uppercase tracking-wider">Failed</p>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger shrink-0">
                                    <LuX size={18} />
                                </div>
                            </div>
                            <p className="text-xl sm:text-2xl font-extrabold tracking-tight">{stats.failedCount}</p>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-default-500">of {totalTx} Total</span>
                                    <span className="text-xs font-bold text-danger">{failedRate}%</span>
                                </div>
                                <Progress value={failedRate} color="danger" size="sm" aria-label="Failed rate" />
                            </div>
                        </CardBody>
                    </Card>
                    <Card shadow="none" className="border border-divider">
                        <CardBody className="p-4 sm:p-5 gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-default-500 uppercase tracking-wider">Recurring</p>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                    <Repeat size={18} />
                                </div>
                            </div>
                            <p className="text-xl sm:text-2xl font-extrabold tracking-tight">{stats.recurringCount}</p>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-default-500">Monthly</span>
                                    <span className="text-xs font-bold text-secondary">{recurringRate}%</span>
                                </div>
                                <Progress value={recurringRate} color="secondary" size="sm" aria-label="Recurring rate" />
                            </div>
                        </CardBody>
                    </Card>
                    <Card shadow="none" className="border border-divider">
                        <CardBody className="p-4 sm:p-5 gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-default-500 uppercase tracking-wider">One-time</p>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning shrink-0">
                                    <Zap size={18} />
                                </div>
                            </div>
                            <p className="text-xl sm:text-2xl font-extrabold tracking-tight">{stats.oneTimeCount}</p>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-default-500">One-time</span>
                                    <span className="text-xs font-bold text-warning">{oneTimeRate}%</span>
                                </div>
                                <Progress value={oneTimeRate} color="warning" size="sm" aria-label="One-time rate" />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Impact Journey
                {stats.totalDonated > 0 && (
                    <Card shadow="none" className="border border-divider overflow-hidden">
                        <CardBody className="p-0">
                            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-divider flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: BRAND }}>Your Impact Journey</p>
                                    <p className="text-sm text-default-600 mt-0.5">
                                        {milestone.pct >= 100
                                            ? "You've reached a milestone — keep going! 🎉"
                                            : `${fmt(milestone.target - stats.totalDonated)} more to reach the ${fmt(milestone.target)} milestone`}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-6">
                                    {memberSince && (
                                        <div className="text-center">
                                            <p className="text-[10px] text-default-400 uppercase tracking-wider">Member Since</p>
                                            <p className="text-sm font-semibold mt-0.5 text-foreground">{memberSince}</p>
                                        </div>
                                    )}
                                    {streak > 0 && (
                                        <div className="text-center">
                                            <p className="text-[10px] text-default-400 uppercase tracking-wider">Streak</p>
                                            <p classNa
                                            me="text-sm font-semibold mt-0.5 text-foreground">🔥 {streak} month{streak > 1 ? "s" : ""}</p>
                                        </div>
                                    )}
                                    {consistency.total > 0 && (
                                        <div className="text-center">
                                            <p className="text-[10px] text-default-400 uppercase tracking-wider">Consistency</p>
                                            <p className="text-sm font-semibold mt-0.5 text-foreground">{consistency.active}/{consistency.total} months</p>
                                        </div>
                                    )}
                                    {thisYearDonated > 0 && (
                                        <div className="text-center">
                                            <p className="text-[10px] text-default-400 uppercase tracking-wider">This Year</p>
                                            <p className="text-sm font-semibold mt-0.5 text-foreground">{fmt(thisYearDonated)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-default-400">{fmt(milestone.prev)}</span>
                                    <span className="text-xs font-semibold" style={{ color: BRAND }}>{Math.min(milestone.pct, 100)}% toward {fmt(milestone.target)}</span>
                                    <span className="text-xs text-default-400">{fmt(milestone.target)}</span>
                                </div>
                                <div className="w-full bg-default-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-2.5 rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min(milestone.pct, 100)}%`, background: `linear-gradient(90deg, ${BRAND}, #59c8d6)` }} />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs text-default-500">Donated: <span className="font-semibold text-foreground">{fmt(stats.totalDonated)}</span></span>
                                    <span className="text-xs text-default-500">Goal: <span className="font-semibold text-foreground">{fmt(milestone.target)}</span></span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}  */}

                {/* All Transactions Table */}
                <Card shadow="none" className="border border-divider">
                    <CardHeader className="px-5 pt-5 pb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2 shrink-0">
                            <p className="text-lg font-bold">All Transactions</p>
                            <Chip size="sm" variant="flat" color="primary" className="h-5 text-xs font-bold">{filtered.length}</Chip>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <Input size="sm" variant="bordered" placeholder="Search ID, category…"
                                value={search} onValueChange={setSearch}
                                startContent={<Search size={13} className="text-default-400" />}
                                classNames={{ base: "w-full sm:w-52", inputWrapper: "h-8" }} />
                            <Select size="sm" variant="bordered" aria-label="Filter type"
                                selectedKeys={[filterType]} onSelectionChange={k => setFilterType([...k][0] as string)}
                                classNames={{ base: "w-32", trigger: "h-8 min-h-8" }}>
                                <SelectItem key="all">All types</SelectItem>
                                <SelectItem key="onetime">One-time</SelectItem>
                                <SelectItem key="recurring">Recurring</SelectItem>
                            </Select>
                            <Select size="sm" variant="bordered" aria-label="Filter status"
                                selectedKeys={[filterStatus]} onSelectionChange={k => setFilterStatus([...k][0] as string)}
                                classNames={{ base: "w-36", trigger: "h-8 min-h-8" }}>
                                <SelectItem key="all">All status</SelectItem>
                                <SelectItem key="success">Success</SelectItem>
                                <SelectItem key="failed">Failed</SelectItem>
                                <SelectItem key="pending">Pending</SelectItem>
                            </Select>
                        </div>
                    </CardHeader>
                    {/* Mobile card list */}
                    <div className="sm:hidden divide-y divide-divider">
                        {filtered.length === 0 ? (
                            <div className="py-16 flex flex-col items-center gap-2 text-default-300">
                                <Search size={32} strokeWidth={1} /><p className="text-sm font-medium">No transactions found</p>
                            </div>
                        ) : filtered.map((tx, i) => {
                            const txId = tx.transactionId || tx.orderId || `#${i}`;
                            const statusColor = isSuccess(tx) ? "success" as const : isFailed(tx) ? "danger" as const : "warning" as const;
                            const catVal = getCategory(tx);
                            return (
                                <div key={txId} className="px-4 py-4 flex flex-col gap-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-default-500">{fmtDate(tx.paymentDate)}</span>
                                        <Chip size="sm" variant="dot" color={statusColor} classNames={{ content: "font-semibold text-xs" }}>{tx.paymentStatus || "Pending"}</Chip>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-base tracking-tight">{fmt(getAmount(tx))}</span>
                                        <Chip size="sm" variant="flat" color={recurring(tx) ? "secondary" : "primary"} classNames={{ content: "font-semibold text-xs" }}>
                                            {recurring(tx) ? "Recurring" : "One-time"}
                                        </Chip>
                                    </div>
                                    {catVal !== "—" && (
                                        <span className="text-xs font-medium text-default-500 truncate">{catVal}</span>
                                    )}
                                    <Tooltip content={txId} delay={300}>
                                        <button onClick={() => copyText(txId)}
                                            className="flex items-center gap-1.5 font-mono text-xs text-default-400 hover:text-primary transition-colors w-fit">
                                            {txId.length > 22 ? txId.slice(0, 22) + "…" : txId}
                                            {copied === txId ? <Check size={11} className="text-success shrink-0" /> : <Copy size={11} className="shrink-0" />}
                                        </button>
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tablet/Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <Table removeWrapper aria-label="Transactions"
                            classNames={{
                                th: "bg-default-100 text-default-500 text-[11px] uppercase tracking-wide font-semibold first:rounded-l-none last:rounded-r-none h-9",
                                td: "py-3 text-sm",
                                tr: "hover:bg-default-50 transition-colors",
                            }}>
                            <TableHeader>
                                <TableColumn>
                                    <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground transition">
                                        Date <SortIcon k="date" />
                                    </button>
                                </TableColumn>
                                <TableColumn>Transaction ID</TableColumn>
                                <TableColumn>
                                    <button onClick={() => toggleSort("amount")} className="flex items-center gap-1 hover:text-foreground transition">
                                        Amount <SortIcon k="amount" />
                                    </button>
                                </TableColumn>
                                <TableColumn className="hidden md:table-cell">
                                    <button onClick={() => toggleSort("category")} className="flex items-center gap-1 hover:text-foreground transition">
                                        Category <SortIcon k="category" />
                                    </button>
                                </TableColumn>
                                <TableColumn className="hidden lg:table-cell">Type</TableColumn>
                                <TableColumn>
                                    <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-foreground transition">
                                        Status <SortIcon k="status" />
                                    </button>
                                </TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={
                                <div className="py-16 flex flex-col items-center gap-2 text-default-300">
                                    <Search size={32} strokeWidth={1} /><p className="text-sm">No transactions found</p>
                                </div>
                            }>
                                {filtered.map((tx, i) => {
                                    const txId = tx.transactionId || tx.orderId || `#${i}`;
                                    const statusColor = isSuccess(tx) ? "success" as const : isFailed(tx) ? "danger" as const : "warning" as const;
                                    const catVal = getCategory(tx);
                                    return (
                                        <TableRow key={txId}>
                                            <TableCell className="text-default-500 text-xs whitespace-nowrap">{fmtDate(tx.paymentDate)}</TableCell>
                                            <TableCell>
                                                <Tooltip content={txId} delay={300}>
                                                    <button onClick={() => copyText(txId)}
                                                        className="flex items-center gap-1.5 font-mono text-xs text-default-400 hover:text-primary transition-colors">
                                                        {txId.length > 14 ? txId.slice(0, 14) + "…" : txId}
                                                        {copied === txId ? <Check size={11} className="text-success shrink-0" /> : <Copy size={11} className="shrink-0" />}
                                                    </button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className="font-semibold">{fmt(getAmount(tx))}</TableCell>
                                            <TableCell className="text-xs max-w-[160px] hidden md:table-cell">
                                                {catVal !== "—"
                                                    ? <span className="truncate block text-default-600">{catVal}</span>
                                                    : <span className="text-default-300">—</span>}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <Chip size="sm" variant="flat" color={recurring(tx) ? "secondary" : "primary"}>
                                                    {recurring(tx) ? "Recurring" : "One-time"}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <Chip size="sm" variant="dot" color={statusColor}>{tx.paymentStatus || "Pending"}</Chip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    {filtered.length > 0 && (
                        <div className="px-5 py-3 border-t border-divider flex items-center justify-between">
                            <p className="text-xs font-medium text-default-500">
                                Showing <span className="font-bold text-foreground">{filtered.length}</span> of {transactions.length} Transactions
                            </p>
                            <p className="text-xs font-medium text-default-500">
                                Total: <span className="font-bold text-foreground">{fmt(filtered.reduce((s, tx) => s + getAmount(tx), 0))}</span>
                            </p>
                        </div>
                    )}
                </Card>

                {/* Monthly Contributions Bar Chart */}
                <Card shadow="none" className="border border-divider">
                    <CardHeader className="px-5 pt-5 pb-0 flex items-start justify-between">
                        <div>
                            <p className="text-lg font-bold">Month Wise Contributions</p>
                            <p className="text-xs font-medium text-default-500 mt-0.5">Total amount donated per month</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0" style={{ color: BRAND }}>
                            <IndianRupee size={18} />
                        </div>
                    </CardHeader>
                    <CardBody className="px-5 pb-5 pt-3">
                        <BarChart data={monthlyData} color={BRAND} />
                    </CardBody>
                </Card>

                {/* Payment Frequency + Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card shadow="none" className="border border-divider lg:col-span-2">
                        <CardHeader className="px-5 pt-5 pb-0 flex items-start justify-between">
                            <div>
                                <p className="text-lg font-bold">Payment Frequency</p>
                                <p className="text-xs font-medium text-default-500 mt-0.5">Payments per month · amount shown above each dot</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0" style={{ color: BRAND }}>
                                <TrendingUp size={18} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-5 pb-5 pt-3">
                            <LineChart data={monthlyData} />
                        </CardBody>
                    </Card>
                    <Card shadow="none" className="border border-divider">
                        <CardHeader className="px-5 pt-5 pb-0">
                            <div>
                                <p className="text-lg font-bold">Payment Health</p>
                                <p className="text-xs font-medium text-default-500 mt-0.5">Success vs failed breakdown</p>
                            </div>
                        </CardHeader>
                        <CardBody className="px-5 pb-5 pt-3 flex flex-col items-center gap-5">
                            <DonutChart successCount={stats.successCount} failedCount={stats.failedCount} total={totalTx} />
                            <div className="w-full space-y-2.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: BRAND }} />
                                        <span className="text-default-600">Successful</span>
                                    </span>
                                    <span className="font-semibold">{stats.successCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-danger shrink-0" />
                                        <span className="text-default-600">Failed</span>
                                    </span>
                                    <span className="font-semibold">{stats.failedCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-default-300 shrink-0" />
                                        <span className="text-default-600">Pending</span>
                                    </span>
                                    <span className="font-semibold">{totalTx - stats.successCount - stats.failedCount}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Category Breakdown */}
                {categoryData.length > 0 && (
                    <Card shadow="none" className="border border-divider">
                        <CardHeader className="px-5 pt-5 pb-0">
                            <div>
                                <p className="text-base font-semibold">Donation Causes</p>
                                <p className="text-xs text-default-400 mt-0.5">Top categories by contribution amount</p>
                            </div>
                        </CardHeader>
                        <CardBody className="px-5 pb-5 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                {categoryData.map((cat, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-default-600 truncate max-w-[68%]">{cat.name}</span>
                                            <span className="text-xs font-semibold shrink-0">{fmtShort(cat.value)}</span>
                                        </div>
                                        <Progress value={cat.pct} color="primary" size="sm" aria-label={cat.name} />
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                )}

            </div>
        </div>
    );
}
