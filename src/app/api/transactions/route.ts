import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "@/lib/finance";

const createSchema = z.object({
  type: z.enum(TRANSACTION_TYPES),
  category: z.enum(TRANSACTION_CATEGORIES),
  amount: z.number().positive(),
  description: z.string().min(1).max(500),
  occurredAt: z.string().optional(),
  bookingId: z.string().nullable().optional(),
});

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const where: Record<string, unknown> = {};
  if (from || to) {
    where.occurredAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }
  try {
    const list = await prisma.transaction.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      include: { booking: { select: { reference: true, customerName: true } } },
    });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = createSchema.parse(await req.json());
    const tx = await prisma.transaction.create({
      data: {
        type: body.type,
        category: body.category,
        amount: body.amount,
        description: body.description,
        occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
        bookingId: body.bookingId ?? null,
        createdBy: admin.email,
      },
    });
    return NextResponse.json(tx, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
