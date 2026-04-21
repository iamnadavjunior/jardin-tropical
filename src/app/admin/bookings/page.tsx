import { AdminShell } from "@/components/admin/admin-shell";
import { BookingsTable } from "@/components/admin/bookings-table";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBookingsPage() {
  let bookings: any[] = [];
  let rooms: { id: string; name: string }[] = [];
  try {
    [bookings, rooms] = await Promise.all([
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: { room: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.room.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ]);
  } catch {
    /* fall through */
  }

  // serialise dates for the client component
  const serialised = bookings.map((b) => ({
    ...b,
    checkIn: b.checkIn.toISOString(),
    checkOut: b.checkOut.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  return (
    <AdminShell>
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div>
          <p className="eyebrow">Reservations</p>
          <h1 className="display-2 mt-3 text-ink">Bookings.</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {bookings.length} {bookings.length === 1 ? "reservation" : "reservations"} on record.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <BookingsTable initialBookings={serialised} rooms={rooms} />
      </div>
    </AdminShell>
  );
}
