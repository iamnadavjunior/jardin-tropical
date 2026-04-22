"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "@/lib/finance";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type Tx = {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  occurredAt: string;
  bookingId: string | null;
  booking?: { reference: string; customerName: string } | null;
  createdBy: string | null;
};

const TYPE_TONE: Record<string, string> = {
  INCOME: "text-emerald-700 bg-emerald-50 ring-emerald-200",
  DEPOSIT: "text-emerald-700 bg-emerald-50 ring-emerald-200",
  EXPENSE: "text-red-700 bg-red-50 ring-red-200",
  WITHDRAWAL: "text-red-700 bg-red-50 ring-red-200",
  REFUND: "text-orange-700 bg-orange-50 ring-orange-200",
};

function isCashIn(type: string) {
  return type === "INCOME" || type === "DEPOSIT";
}

export function FinanceDashboard({ initial }: { initial: Tx[] }) {
  const [items, setItems] = useState<Tx[]>(initial);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [refreshing, startRefresh] = useTransition();

  // Light auto-refresh
  useEffect(() => {
    const t = setInterval(() => refresh(true), 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(silent = false) {
    if (!silent) startRefresh(() => {});
    const r = await fetch("/api/transactions", { cache: "no-store" });
    if (r.ok) setItems(await r.json());
  }

  async function remove(id: string) {
    if (!confirm("Delete this transaction permanently?")) return;
    setItems((xs) => xs.filter((x) => x.id !== id));
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  }

  const filtered = useMemo(() => {
    return items.filter((t) => {
      if (type !== "ALL" && t.type !== type) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !t.description.toLowerCase().includes(s) &&
          !t.category.toLowerCase().includes(s) &&
          !(t.booking?.reference.toLowerCase().includes(s) ?? false) &&
          !(t.booking?.customerName.toLowerCase().includes(s) ?? false)
        )
          return false;
      }
      return true;
    });
  }, [items, q, type]);

  const totals = useMemo(() => {
    const income = items
      .filter((t) => t.type === "INCOME" || t.type === "DEPOSIT")
      .reduce((s, t) => s + t.amount, 0);
    const expense = items
      .filter((t) => t.type === "EXPENSE" || t.type === "WITHDRAWAL")
      .reduce((s, t) => s + t.amount, 0);
    const refunds = items.filter((t) => t.type === "REFUND").reduce((s, t) => s + t.amount, 0);
    return { income, expense, refunds, balance: income - expense - refunds };
  }, [items]);

  return (
    <>
      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-10">
        <Stat label="Total balance" value={formatCurrency(totals.balance)} tone="text-ink" />
        <Stat label="Cash in" value={formatCurrency(totals.income)} tone="text-emerald-700" />
        <Stat label="Cash out" value={formatCurrency(totals.expense)} tone="text-red-700" />
        <Stat label="Refunds" value={formatCurrency(totals.refunds)} tone="text-orange-700" />
      </div>

      {/* Toolbar */}
      <div className="card-soft p-4 flex flex-wrap items-center gap-3 mt-10">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search description, booking ref…"
            className="field pl-9"
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className="field max-w-[180px]">
          <option value="ALL">All types</option>
          {TRANSACTION_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button onClick={() => refresh()} className="btn-ghost">
          <RefreshCw size={14} className={cn(refreshing && "animate-spin")} /> Refresh
        </button>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={14} /> New transaction
        </button>
      </div>

      {/* Table */}
      <div className="card-soft overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-[0.16em] text-ink-muted bg-cream-100">
              <tr>
                <th className="text-left font-medium px-6 py-3">Date</th>
                <th className="text-left font-medium px-6 py-3">Description</th>
                <th className="text-left font-medium px-6 py-3">Category</th>
                <th className="text-left font-medium px-6 py-3">Booking</th>
                <th className="text-right font-medium px-6 py-3">Amount</th>
                <th className="text-left font-medium px-6 py-3">Type</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-ink-muted">
                    No transactions yet.
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-cream-100/60 transition-colors">
                  <td className="px-6 py-4 text-ink-muted text-xs">{formatDate(t.occurredAt)}</td>
                  <td className="px-6 py-4 text-ink">{t.description}</td>
                  <td className="px-6 py-4 text-ink-muted text-xs">{t.category.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4 font-mono text-xs text-ink-muted">
                    {t.booking?.reference ?? "—"}
                  </td>
                  <td className={cn("px-6 py-4 text-right font-medium", isCashIn(t.type) ? "text-emerald-700" : "text-red-700")}>
                    {isCashIn(t.type) ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ring-1", TYPE_TONE[t.type] ?? "bg-ink/5 text-ink-muted ring-ink/10")}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => remove(t.id)} className="text-ink-muted hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddDrawer onClose={() => setShowAdd(false)} onCreated={(t) => setItems((xs) => [t, ...xs])} />}
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="card-soft p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">{label}</p>
      <p className={cn("mt-3 font-serif text-3xl", tone)}>{value}</p>
    </div>
  );
}

function AddDrawer({ onClose, onCreated }: { onClose: () => void; onCreated: (t: Tx) => void }) {
  const [type, setType] = useState<string>("EXPENSE");
  const [category, setCategory] = useState<string>("UTILITIES");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [occurredAt, setOccurredAt] = useState<string>(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const r = await fetch("/api/transactions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type,
        category,
        amount: Number(amount),
        description,
        occurredAt: new Date(occurredAt).toISOString(),
      }),
    });
    setBusy(false);
    if (!r.ok) {
      setErr("Could not save. Check the form and try again.");
      return;
    }
    const created = await r.json();
    onCreated(created);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-cream overflow-y-auto shadow-2xl"
      >
        <div className="p-8 border-b border-ink/5 flex items-start justify-between">
          <div>
            <p className="eyebrow">Finance</p>
            <h3 className="font-serif text-2xl text-ink mt-2">New transaction</h3>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="p-8 space-y-5">
          <div>
            <label className="label">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="field">
              {TRANSACTION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="field">
              {TRANSACTION_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Amount</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="field"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="label">Date</label>
            <input
              required
              type="date"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="field"
              placeholder="e.g. Electricity bill — March"
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button disabled={busy} className="btn-primary disabled:opacity-50">
              {busy ? "Saving…" : "Save transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
