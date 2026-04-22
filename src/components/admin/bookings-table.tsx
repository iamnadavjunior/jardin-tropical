"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Search, RefreshCw, Trash2 } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type Booking = {
  id: string;
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: "BOOKED" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED" | "NO_SHOW";
  notes: string | null;
  createdAt: string;
  room: { id: string; name: string; slug: string };
};

const STATUSES = [
  "BOOKED",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
] as const;

const statusStyle: Record<string, string> = {
  BOOKED: "bg-blue-50 text-blue-700 ring-blue-200",
  CONFIRMED: "bg-amber-50 text-amber-700 ring-amber-200",
  CHECKED_IN: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CHECKED_OUT: "bg-ink/5 text-ink-muted ring-ink/10",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
  NO_SHOW: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function BookingsTable({
  initialBookings,
  rooms,
}: {
  initialBookings: Booking[];
  rooms: { id: string; name: string }[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [roomId, setRoomId] = useState<string>("ALL");
  const [refreshing, startRefresh] = useTransition();
  const [open, setOpen] = useState<Booking | null>(null);

  // Real-time sync — light polling every 15s
  useEffect(() => {
    const t = setInterval(() => refresh(true), 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(silent = false) {
    if (!silent) startRefresh(() => {});
    const r = await fetch("/api/bookings", { cache: "no-store" });
    if (r.ok) setBookings(await r.json());
  }

  async function updateStatus(id: string, newStatus: Booking["status"]) {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking permanently?")) return;
    setBookings((bs) => bs.filter((b) => b.id !== id));
    setOpen(null);
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
  }

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (status !== "ALL" && b.status !== status) return false;
      if (roomId !== "ALL" && b.room.id !== roomId) return false;
      if (q) {
        const t = q.toLowerCase();
        if (
          !b.reference.toLowerCase().includes(t) &&
          !b.customerName.toLowerCase().includes(t) &&
          !b.email.toLowerCase().includes(t) &&
          !b.room.name.toLowerCase().includes(t)
        )
          return false;
      }
      return true;
    });
  }, [bookings, q, status, roomId]);

  return (
    <>
      {/* Filters */}
      <div className="card-soft p-4 flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by reference, guest, email…"
            className="field pl-9"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field max-w-[180px]">
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="field max-w-[180px]">
          <option value="ALL">All rooms</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <button
          onClick={() => refresh()}
          className="btn-ghost"
          title="Refresh"
        >
          <RefreshCw size={14} className={cn(refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-[0.16em] text-ink-muted bg-cream-100">
              <tr>
                <th className="text-left font-medium px-6 py-3">Ref</th>
                <th className="text-left font-medium px-6 py-3">Guest</th>
                <th className="text-left font-medium px-6 py-3">Room</th>
                <th className="text-left font-medium px-6 py-3">Check-in</th>
                <th className="text-left font-medium px-6 py-3">Check-out</th>
                <th className="text-left font-medium px-6 py-3">Nights</th>
                <th className="text-left font-medium px-6 py-3">Total</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-ink-muted">
                    No bookings match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setOpen(b)}
                  className="hover:bg-cream-100/60 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-ink">{b.reference}</td>
                  <td className="px-6 py-4">
                    <div className="text-ink">{b.customerName}</div>
                    <div className="text-xs text-ink-muted">{b.email}</div>
                  </td>
                  <td className="px-6 py-4 text-ink">{b.room.name}</td>
                  <td className="px-6 py-4 text-ink-muted text-xs">{formatDate(b.checkIn)}</td>
                  <td className="px-6 py-4 text-ink-muted text-xs">{formatDate(b.checkOut)}</td>
                  <td className="px-6 py-4 text-ink-muted">{b.nights}</td>
                  <td className="px-6 py-4 text-ink">{formatCurrency(b.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ring-1 ${statusStyle[b.status]}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-ink-muted">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50" onClick={() => setOpen(null)}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-up" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-cream overflow-y-auto shadow-2xl animate-fade-up"
          >
            <div className="p-8 border-b border-ink/5">
              <p className="font-mono text-xs text-ink-muted">{open.reference}</p>
              <h3 className="font-serif text-3xl text-ink mt-2">{open.customerName}</h3>
              <p className="text-sm text-ink-muted mt-1">{open.email} · {open.phone}</p>
            </div>

            <div className="p-8 space-y-2">
              <KV k="Room" v={open.room.name} />
              <KV k="Check-in" v={formatDate(open.checkIn)} />
              <KV k="Check-out" v={formatDate(open.checkOut)} />
              <KV k="Nights" v={String(open.nights)} />
              <KV k="Guests" v={String(open.guests)} />
              <KV k="Total" v={formatCurrency(open.totalPrice)} />
              <KV k="Created" v={formatDate(open.createdAt)} />
            </div>

            {open.notes && (
              <div className="px-8 pb-6">
                <p className="label">Special requests</p>
                <p className="text-sm text-ink leading-relaxed">{open.notes}</p>
              </div>
            )}

            <div className="px-8 pb-8">
              <p className="label">Status</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(open.id, s)}
                    className={cn(
                      "text-xs px-3 py-2.5 rounded-lg border transition-all",
                      open.status === s
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/15 hover:border-ink/40"
                    )}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 pb-10 flex gap-3">
              <button onClick={() => setOpen(null)} className="btn-outline flex-1">Close</button>
              <button onClick={() => remove(open.id)} className="btn flex-1 bg-red-50 text-red-700 hover:bg-red-100">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 py-2">
      <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">{k}</span>
      <span className="text-sm text-ink text-right">{v}</span>
    </div>
  );
}
