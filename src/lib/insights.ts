import { prisma } from "./prisma";
import { signedAmount } from "./finance";

export type GrowthState = "GROWING" | "STABLE" | "DECLINING" | "DEATH";

export type Insights = {
  state: GrowthState;
  label: string;
  message: string;
  scorePct: number; // -100..+100 (revenue MoM)
  metrics: {
    revenueLast30: number;
    revenuePrev30: number;
    revenueChangePct: number;
    bookingsLast30: number;
    bookingsPrev30: number;
    bookingsChangePct: number;
    occupancyLast30Pct: number;
    occupancyPrev30Pct: number;
    netCashLast30: number;
    expensesLast30: number;
    adr: number; // average daily rate
    revPAR: number; // revenue per available room
  };
  series: { month: string; income: number; expense: number; net: number }[];
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function pct(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

export async function buildInsights(): Promise<Insights> {
  const now = new Date();
  const today = startOfDay(now);
  const day30 = new Date(today.getTime() - 30 * 86400000);
  const day60 = new Date(today.getTime() - 60 * 86400000);

  // Defensive default
  const empty: Insights = {
    state: "STABLE",
    label: "Awaiting data",
    message: "Not enough activity yet to compute trends.",
    scorePct: 0,
    metrics: {
      revenueLast30: 0,
      revenuePrev30: 0,
      revenueChangePct: 0,
      bookingsLast30: 0,
      bookingsPrev30: 0,
      bookingsChangePct: 0,
      occupancyLast30Pct: 0,
      occupancyPrev30Pct: 0,
      netCashLast30: 0,
      expensesLast30: 0,
      adr: 0,
      revPAR: 0,
    },
    series: [],
  };

  try {
    const [txns, bookings, totalRooms] = await Promise.all([
      prisma.transaction.findMany({
        where: { occurredAt: { gte: day60 } },
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: day60 }, status: { not: "CANCELLED" } },
      }),
      prisma.room.count(),
    ]);

    // 30/60-day buckets
    const last30Tx = txns.filter((t) => t.occurredAt >= day30);
    const prev30Tx = txns.filter((t) => t.occurredAt < day30 && t.occurredAt >= day60);

    const revenueLast30 = last30Tx
      .filter((t) => t.type === "INCOME" || t.type === "DEPOSIT")
      .reduce((s, t) => s + t.amount, 0);
    const revenuePrev30 = prev30Tx
      .filter((t) => t.type === "INCOME" || t.type === "DEPOSIT")
      .reduce((s, t) => s + t.amount, 0);

    const expensesLast30 = last30Tx
      .filter((t) => t.type === "EXPENSE" || t.type === "WITHDRAWAL")
      .reduce((s, t) => s + t.amount, 0);

    const netCashLast30 = last30Tx.reduce((s, t) => s + signedAmount(t), 0);

    const bookingsLast30 = bookings.filter((b) => b.createdAt >= day30).length;
    const bookingsPrev30 = bookings.filter(
      (b) => b.createdAt < day30 && b.createdAt >= day60
    ).length;

    // Occupancy = booked nights / available nights (rooms × 30)
    const nightsLast30 = bookings
      .filter((b) => b.checkIn < today && b.checkOut > day30)
      .reduce((s, b) => {
        const start = b.checkIn > day30 ? b.checkIn : day30;
        const end = b.checkOut < today ? b.checkOut : today;
        return s + Math.max(0, (end.getTime() - start.getTime()) / 86400000);
      }, 0);
    const nightsPrev30 = bookings
      .filter((b) => b.checkIn < day30 && b.checkOut > day60)
      .reduce((s, b) => {
        const start = b.checkIn > day60 ? b.checkIn : day60;
        const end = b.checkOut < day30 ? b.checkOut : day30;
        return s + Math.max(0, (end.getTime() - start.getTime()) / 86400000);
      }, 0);

    const totalAvailNights = Math.max(1, totalRooms) * 30;
    const occupancyLast30Pct = (nightsLast30 / totalAvailNights) * 100;
    const occupancyPrev30Pct = (nightsPrev30 / totalAvailNights) * 100;

    const adr = nightsLast30 > 0 ? revenueLast30 / nightsLast30 : 0;
    const revPAR = totalAvailNights > 0 ? revenueLast30 / totalAvailNights : 0;

    const revenueChangePct = pct(revenueLast30, revenuePrev30);
    const bookingsChangePct = pct(bookingsLast30, bookingsPrev30);

    // Build 6-month series for chart
    const series: { month: string; income: number; expense: number; net: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const inMonth = await prisma.transaction.findMany({
        where: { occurredAt: { gte: start, lt: end } },
        select: { type: true, amount: true },
      });
      const income = inMonth
        .filter((t) => t.type === "INCOME" || t.type === "DEPOSIT")
        .reduce((s, t) => s + t.amount, 0);
      const expense = inMonth
        .filter((t) => t.type === "EXPENSE" || t.type === "WITHDRAWAL" || t.type === "REFUND")
        .reduce((s, t) => s + t.amount, 0);
      series.push({
        month: start.toLocaleDateString("en", { month: "short" }),
        income,
        expense,
        net: income - expense,
      });
    }

    // Classify state
    let state: GrowthState = "STABLE";
    let label = "Stable";
    let message = "Performance is steady — keep nurturing demand.";

    const noActivity = revenueLast30 === 0 && bookingsLast30 === 0 && bookingsPrev30 === 0;
    if (noActivity) {
      state = "DEATH";
      label = "Dormant";
      message =
        "No revenue or bookings in the last 60 days. Time to refresh marketing, prices, or listings.";
    } else if (revenueLast30 === 0 && revenuePrev30 > 0) {
      state = "DEATH";
      label = "At risk";
      message = "Revenue dropped to zero this period. Investigate cancellations and demand.";
    } else if (revenueChangePct >= 10 || bookingsChangePct >= 15) {
      state = "GROWING";
      label = "Growing";
      message = `Revenue ${revenueChangePct >= 0 ? "up" : "down"} ${Math.round(
        Math.abs(revenueChangePct)
      )}% MoM with ${bookingsLast30} new bookings — keep pushing visibility.`;
    } else if (revenueChangePct <= -15 || bookingsChangePct <= -20) {
      state = "DECLINING";
      label = "Declining";
      message = `Revenue ${Math.round(Math.abs(revenueChangePct))}% lower than last 30 days. Consider promotions or revisiting pricing.`;
    } else {
      state = "STABLE";
      label = "Stable";
      message = `Revenue change ${revenueChangePct >= 0 ? "+" : ""}${Math.round(
        revenueChangePct
      )}% — performance flat. Try a small campaign to spark growth.`;
    }

    return {
      state,
      label,
      message,
      scorePct: Math.max(-100, Math.min(100, Math.round(revenueChangePct))),
      metrics: {
        revenueLast30,
        revenuePrev30,
        revenueChangePct,
        bookingsLast30,
        bookingsPrev30,
        bookingsChangePct,
        occupancyLast30Pct,
        occupancyPrev30Pct,
        netCashLast30,
        expensesLast30,
        adr,
        revPAR,
      },
      series,
    };
  } catch {
    return empty;
  }
}
