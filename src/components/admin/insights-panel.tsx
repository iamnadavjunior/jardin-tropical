import { Activity, AlertTriangle, Skull, TrendingDown, TrendingUp } from "lucide-react";
import type { Insights } from "@/lib/insights";
import { formatCurrency } from "@/lib/utils";

const STATE_STYLES: Record<
  Insights["state"],
  { bg: string; ring: string; text: string; Icon: typeof TrendingUp }
> = {
  GROWING: { bg: "bg-emerald-50", ring: "ring-emerald-200", text: "text-emerald-700", Icon: TrendingUp },
  STABLE: { bg: "bg-amber-50", ring: "ring-amber-200", text: "text-amber-700", Icon: Activity },
  DECLINING: { bg: "bg-orange-50", ring: "ring-orange-200", text: "text-orange-700", Icon: TrendingDown },
  DEATH: { bg: "bg-red-50", ring: "ring-red-200", text: "text-red-700", Icon: Skull },
};

export function InsightsPanel({ insights }: { insights: Insights }) {
  const style = STATE_STYLES[insights.state];
  const { metrics } = insights;
  return (
    <div className="card-soft overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        {/* Verdict */}
        <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-ink/5">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full ring-1 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] ${style.bg} ${style.ring} ${style.text}`}>
              <style.Icon size={13} strokeWidth={2} />
              {insights.label}
            </span>
            {insights.state === "DEATH" && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-red-600">
                <AlertTriangle size={12} /> Action recommended
              </span>
            )}
          </div>
          <h3 className="font-serif text-2xl text-ink mt-5">Business pulse — last 30 days</h3>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">{insights.message}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Mini
              label="Revenue"
              value={formatCurrency(metrics.revenueLast30)}
              hint={`${metrics.revenueChangePct >= 0 ? "+" : ""}${Math.round(metrics.revenueChangePct)}% vs prev. 30d`}
              positive={metrics.revenueChangePct >= 0}
            />
            <Mini
              label="Bookings"
              value={metrics.bookingsLast30.toString()}
              hint={`${metrics.bookingsChangePct >= 0 ? "+" : ""}${Math.round(metrics.bookingsChangePct)}% vs prev. 30d`}
              positive={metrics.bookingsChangePct >= 0}
            />
            <Mini
              label="Occupancy"
              value={`${Math.round(metrics.occupancyLast30Pct)}%`}
              hint={`Was ${Math.round(metrics.occupancyPrev30Pct)}%`}
              positive={metrics.occupancyLast30Pct >= metrics.occupancyPrev30Pct}
            />
            <Mini
              label="Net cash"
              value={formatCurrency(metrics.netCashLast30)}
              hint={`Expenses ${formatCurrency(metrics.expensesLast30)}`}
              positive={metrics.netCashLast30 >= 0}
            />
          </div>
        </div>

        {/* KPIs + chart */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-3">
            <KPI label="ADR" value={formatCurrency(metrics.adr)} sub="Avg daily rate" />
            <KPI label="RevPAR" value={formatCurrency(metrics.revPAR)} sub="Revenue / available room" />
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            6-month cash flow
          </p>
          <MiniBarChart series={insights.series} />
        </div>
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  hint,
  positive,
}: {
  label: string;
  value: string;
  hint: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-xl bg-cream-100 ring-1 ring-ink/5 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">{label}</p>
      <p className="font-serif text-xl text-ink mt-1.5">{value}</p>
      <p className={`mt-1 text-[11px] ${positive ? "text-emerald-600" : "text-red-600"}`}>{hint}</p>
    </div>
  );
}

function KPI({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl ring-1 ring-ink/10 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">{label}</p>
      <p className="font-serif text-xl text-ink mt-1.5">{value}</p>
      <p className="text-[11px] text-ink-muted mt-1">{sub}</p>
    </div>
  );
}

function MiniBarChart({ series }: { series: Insights["series"] }) {
  const max = Math.max(1, ...series.map((s) => Math.max(s.income, s.expense)));
  return (
    <div className="mt-3 flex items-end gap-3 h-36">
      {series.map((s) => {
        const inH = (s.income / max) * 100;
        const exH = (s.expense / max) * 100;
        return (
          <div key={s.month} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-end gap-1 h-28 w-full justify-center">
              <div
                className="w-2.5 rounded-t bg-emerald-500/80"
                style={{ height: `${inH}%` }}
                title={`Income: ${s.income}`}
              />
              <div
                className="w-2.5 rounded-t bg-red-400/80"
                style={{ height: `${exH}%` }}
                title={`Expense: ${s.expense}`}
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted">{s.month}</span>
          </div>
        );
      })}
      <div className="flex flex-col gap-2 text-[10px] text-ink-muted pl-2">
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500/80" />In</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-400/80" />Out</span>
      </div>
    </div>
  );
}
