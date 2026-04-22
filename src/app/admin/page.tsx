import Link from "next/link";
import { CalendarCheck, DollarSign, Users, BedDouble, ArrowRight, TrendingUp, Wallet } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { InsightsPanel } from "@/components/admin/insights-panel";
import { prisma } from "@/lib/prisma";
import { buildInsights } from "@/lib/insights";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getMetrics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = new Date(now.toDateString());

  try {
    const [totalBookings, monthBookings, activeGuests, rooms, recent, revenueAgg] = await Promise.all([
      prisma.booking.count({ where: { status: { not: "CANCELLED" } } }),
      prisma.booking.count({ where: { status: { not: "CANCELLED" }, createdAt: { gte: startOfMonth } } }),
      prisma.booking.count({ where: { status: "CHECKED_IN" } }),
      prisma.room.findMany({ select: { id: true, name: true, available: true } }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { room: { select: { name: true, slug: true } } },
      }),
      prisma.booking.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalPrice: true },
      }),
    ]);

    const occupiedRoomIds = await prisma.booking.findMany({
      where: {
        status: { in: ["BOOKED", "CHECKED_IN"] },
        checkIn: { lte: today },
        checkOut: { gt: today },
      },
      select: { roomId: true },
    });
    const occupiedSet = new Set(occupiedRoomIds.map((b) => b.roomId));
    const available = rooms.filter((r) => r.available && !occupiedSet.has(r.id)).length;

    return {
      totalBookings,
      monthBookings,
      activeGuests,
      available,
      totalRooms: rooms.length,
      revenue: revenueAgg._sum.totalPrice ?? 0,
      recent,
    };
  } catch {
    return { totalBookings: 0, monthBookings: 0, activeGuests: 0, available: 0, totalRooms: 6, revenue: 0, recent: [] };
  }
}

const statusColor: Record<string, string> = {
  BOOKED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-amber-100 text-amber-700",
  CHECKED_IN: "bg-emerald-100 text-emerald-700",
  CHECKED_OUT: "bg-ink/10 text-ink-muted",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-orange-100 text-orange-700",
};

export default async function AdminDashboardPage() {
  const [m, insights] = await Promise.all([getMetrics(), buildInsights()]);

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="display-2 mt-3 text-ink">Dashboard.</h1>
          <p className="mt-2 text-sm text-ink-muted">
            A live view of bookings, occupancy and revenue.
          </p>
        </div>
        <p className="text-xs text-ink-muted">
          Updated {new Date().toLocaleString()}
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total bookings" value={m.totalBookings.toString()} hint={`${m.monthBookings} this month`} Icon={CalendarCheck} />
        <Stat label="Revenue" value={formatCurrency(m.revenue)} hint="All-time, non-cancelled" Icon={DollarSign} />
        <Stat label="Active guests" value={m.activeGuests.toString()} hint="Currently checked-in" Icon={Users} />
        <Stat label="Available rooms" value={`${m.available} / ${m.totalRooms}`} hint="Tonight" Icon={BedDouble} />
      </div>

      {/* Intelligent insights */}
      <div className="mt-10">
        <InsightsPanel insights={insights} />
      </div>

      {/* Recent bookings */}
      <div className="mt-12 card-soft">
        <div className="flex items-center justify-between p-6 border-b border-ink/5">
          <div>
            <h2 className="font-serif text-xl text-ink">Recent bookings</h2>
            <p className="text-xs text-ink-muted mt-1">Latest reservations across all rooms.</p>
          </div>
          <Link href="/admin/bookings" className="text-sm text-ink-muted hover:text-ink inline-flex items-center gap-1.5">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-[0.16em] text-ink-muted bg-cream-100">
              <tr>
                <th className="text-left font-medium px-6 py-3">Reference</th>
                <th className="text-left font-medium px-6 py-3">Guest</th>
                <th className="text-left font-medium px-6 py-3">Room</th>
                <th className="text-left font-medium px-6 py-3">Dates</th>
                <th className="text-left font-medium px-6 py-3">Total</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {m.recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-muted">
                    No bookings yet.
                  </td>
                </tr>
              )}
              {m.recent.map((b) => (
                <tr key={b.id} className="hover:bg-cream-100/60 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-ink">{b.reference}</td>
                  <td className="px-6 py-4">
                    <div className="text-ink">{b.customerName}</div>
                    <div className="text-xs text-ink-muted">{b.email}</div>
                  </td>
                  <td className="px-6 py-4 text-ink">{b.room.name}</td>
                  <td className="px-6 py-4 text-ink-muted text-xs">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </td>
                  <td className="px-6 py-4 text-ink">{formatCurrency(b.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${statusColor[b.status] ?? statusColor.BOOKED}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/admin/bookings" className="card-soft p-6 hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="eyebrow">Manage</p>
            <h3 className="font-serif text-xl text-ink mt-2">Bookings</h3>
            <p className="text-sm text-ink-muted mt-1">Filter, update status, view guest details.</p>
          </div>
          <ArrowRight size={18} className="text-ink-muted group-hover:text-ink group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/admin/finance" className="card-soft p-6 hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="eyebrow">Track</p>
            <h3 className="font-serif text-xl text-ink mt-2">Finance</h3>
            <p className="text-sm text-ink-muted mt-1">Deposits, withdrawals, balances, reports.</p>
          </div>
          <Wallet size={18} className="text-ink-muted group-hover:text-ink transition-all" />
        </Link>
        <Link href="/admin/rooms" className="card-soft p-6 hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="eyebrow">Manage</p>
            <h3 className="font-serif text-xl text-ink mt-2">Rooms</h3>
            <p className="text-sm text-ink-muted mt-1">Edit pricing, descriptions and availability.</p>
          </div>
          <ArrowRight size={18} className="text-ink-muted group-hover:text-ink group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, hint, Icon }: { label: string; value: string; hint: string; Icon: typeof CalendarCheck }) {
  return (
    <div className="card-soft p-6">
      <div className="flex items-start justify-between">
        <div className="grid place-items-center w-10 h-10 rounded-full bg-gold/10 text-gold-600">
          <Icon size={18} strokeWidth={1.6} />
        </div>
        <TrendingUp size={14} className="text-ink-muted/50" />
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-ink-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{hint}</p>
    </div>
  );
}
