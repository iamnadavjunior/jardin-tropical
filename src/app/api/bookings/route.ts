import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { diffNights, generateRef } from "@/lib/utils";
import { recordBookingEvent } from "@/lib/finance";

const schema = z.object({
  roomSlug: z.string().min(1),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  guests: z.number().int().min(1),
  checkIn: z.string().min(8),
  checkOut: z.string().min(8),
  notes: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    if (Number.isNaN(+checkIn) || Number.isNaN(+checkOut) || checkOut <= checkIn) {
      return NextResponse.json({ error: "Invalid dates." }, { status: 400 });
    }
    if (checkIn < new Date(new Date().toDateString())) {
      return NextResponse.json({ error: "Check-in cannot be in the past." }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { slug: data.roomSlug } });
    if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });
    if (!room.available) return NextResponse.json({ error: "Room is not available." }, { status: 409 });
    if (data.guests > room.capacity) {
      return NextResponse.json({ error: "Too many guests for this room." }, { status: 400 });
    }

    // Conflict check — overlapping non-cancelled bookings
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { not: "CANCELLED" },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn },
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "These dates are already booked. Please choose other dates." }, { status: 409 });
    }

    const nights = diffNights(checkIn, checkOut);
    const totalPrice = room.price * nights;

    // Generate unique reference (retry on collision)
    let reference = generateRef();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.booking.findUnique({ where: { reference } });
      if (!exists) break;
      reference = generateRef();
    }

    const booking = await prisma.booking.create({
      data: {
        reference,
        roomId: room.id,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        guests: data.guests,
        checkIn,
        checkOut,
        nights,
        totalPrice,
        notes: data.notes ?? null,
      },
    });

    // Record initial reservation deposit (auto-tracked in finance dashboard)
    await recordBookingEvent(booking.id, "BOOKED");

    // TODO: send confirmation email here (e.g. with Resend)

    return NextResponse.json({ ok: true, reference: booking.reference, id: booking.id }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: e.flatten() }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { room: { select: { name: true, slug: true } } },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 200 });
  }
}
