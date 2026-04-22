import { prisma } from "./prisma";

export const TRANSACTION_TYPES = [
  "INCOME",
  "EXPENSE",
  "REFUND",
  "DEPOSIT",
  "WITHDRAWAL",
] as const;

export const TRANSACTION_CATEGORIES = [
  "ROOM_REVENUE",
  "DEPOSIT",
  "REFUND",
  "UTILITIES",
  "PAYROLL",
  "MAINTENANCE",
  "SUPPLIES",
  "MARKETING",
  "TAXES",
  "OTHER",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

/** Sign convention — positive cash-in, negative cash-out. */
export function signedAmount(t: { type: string; amount: number }): number {
  if (t.type === "EXPENSE" || t.type === "REFUND" || t.type === "WITHDRAWAL") {
    return -Math.abs(t.amount);
  }
  return Math.abs(t.amount);
}

/** Record a booking-related transaction (idempotent — won't double-post). */
export async function recordBookingEvent(
  bookingId: string,
  event: "BOOKED" | "CONFIRMED" | "CHECKED_OUT" | "CANCELLED",
  meta?: { description?: string; createdBy?: string }
) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return null;

  const tag = `[${event}:${booking.reference}]`;

  // Avoid duplicates for the same event on the same booking
  const existing = await prisma.transaction.findFirst({
    where: { bookingId, description: { contains: tag } },
  });
  if (existing) return existing;

  switch (event) {
    case "BOOKED": {
      // Reservation deposit (30% of total) recorded as DEPOSIT/income
      const deposit = Math.round(booking.totalPrice * 0.3);
      return prisma.transaction.create({
        data: {
          type: "DEPOSIT",
          category: "DEPOSIT",
          amount: deposit,
          description:
            meta?.description ?? `Reservation deposit · ${booking.customerName} ${tag}`,
          occurredAt: new Date(),
          bookingId,
          createdBy: meta?.createdBy ?? "system",
        },
      });
    }
    case "CONFIRMED": {
      // No-op (kept for audit trail); intentionally skip extra transaction.
      return null;
    }
    case "CHECKED_OUT": {
      // Balance: total - sum(positive) already posted for this booking.
      const sumAgg = await prisma.transaction.aggregate({
        where: { bookingId, type: { in: ["INCOME", "DEPOSIT"] } },
        _sum: { amount: true },
      });
      const alreadyPaid = sumAgg._sum.amount ?? 0;
      const balance = Math.max(0, Math.round(booking.totalPrice - alreadyPaid));
      if (balance === 0) return null;
      return prisma.transaction.create({
        data: {
          type: "INCOME",
          category: "ROOM_REVENUE",
          amount: balance,
          description: `Room revenue · ${booking.customerName} ${tag}`,
          occurredAt: new Date(),
          bookingId,
          createdBy: meta?.createdBy ?? "system",
        },
      });
    }
    case "CANCELLED": {
      // Refund any positive transactions previously posted for this booking.
      const sumAgg = await prisma.transaction.aggregate({
        where: { bookingId, type: { in: ["INCOME", "DEPOSIT"] } },
        _sum: { amount: true },
      });
      const alreadyPaid = sumAgg._sum.amount ?? 0;
      if (alreadyPaid <= 0) return null;
      return prisma.transaction.create({
        data: {
          type: "REFUND",
          category: "REFUND",
          amount: alreadyPaid,
          description: `Refund on cancellation · ${booking.customerName} ${tag}`,
          occurredAt: new Date(),
          bookingId,
          createdBy: meta?.createdBy ?? "system",
        },
      });
    }
  }
}
