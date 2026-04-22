import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { recordBookingEvent } from "@/lib/finance";

const STATUSES = [
  "BOOKED",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
] as const;

const patchSchema = z.object({
  status: z.enum(STATUSES),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = patchSchema.parse(await req.json());
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: data.status },
    });

    // Auto-record finance event when relevant
    if (data.status === "CONFIRMED" || data.status === "CHECKED_OUT" || data.status === "CANCELLED") {
      await recordBookingEvent(updated.id, data.status, { createdBy: admin.email });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
