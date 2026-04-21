import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  shortDesc: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  capacity: z.number().int().min(1).optional(),
  beds: z.number().int().min(1).optional(),
  size: z.number().int().min(1).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const updated = await prisma.room.update({
      where: { id: params.id },
      data: {
        ...data,
        amenities: data.amenities ? JSON.stringify(data.amenities) : undefined,
        images: data.images ? JSON.stringify(data.images) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
