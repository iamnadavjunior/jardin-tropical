import { AdminShell } from "@/components/admin/admin-shell";
import { FinanceDashboard } from "@/components/admin/finance-dashboard";
import { InsightsPanel } from "@/components/admin/insights-panel";
import { prisma } from "@/lib/prisma";
import { buildInsights } from "@/lib/insights";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminFinancePage() {
  let txns: any[] = [];
  try {
    txns = await prisma.transaction.findMany({
      orderBy: { occurredAt: "desc" },
      include: { booking: { select: { reference: true, customerName: true } } },
    });
  } catch {
    /* ignore */
  }
  const insights = await buildInsights();

  const serialised = txns.map((t) => ({
    ...t,
    occurredAt: t.occurredAt.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <AdminShell>
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div>
          <p className="eyebrow">Finance</p>
          <h1 className="display-2 mt-3 text-ink">Financial management.</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Deposits, withdrawals, balances, and account activity — all hotel-related transactions.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <InsightsPanel insights={insights} />
      </div>

      <FinanceDashboard initial={serialised} />
    </AdminShell>
  );
}
