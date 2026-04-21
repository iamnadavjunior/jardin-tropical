import { prisma } from "./prisma";
import { STATIC_ROOMS, type StaticRoom } from "@/data/rooms";
import { safeJsonArray } from "./utils";

export type RoomDTO = StaticRoom & { id: string; available: boolean };

export async function getAllRooms(): Promise<RoomDTO[]> {
  try {
    const rows = await prisma.room.findMany({ orderBy: [{ featured: "desc" }, { price: "desc" }] });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      price: r.price,
      capacity: r.capacity,
      beds: r.beds,
      size: r.size,
      shortDesc: r.shortDesc,
      description: r.description,
      images: safeJsonArray(r.images),
      amenities: safeJsonArray(r.amenities),
      featured: r.featured,
      available: r.available,
    }));
  } catch {
    return STATIC_ROOMS.map((r) => ({ ...r, id: r.slug, available: true }));
  }
}

export async function getRoomBySlug(slug: string): Promise<RoomDTO | null> {
  try {
    const r = await prisma.room.findUnique({ where: { slug } });
    if (!r) throw new Error("not found");
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      price: r.price,
      capacity: r.capacity,
      beds: r.beds,
      size: r.size,
      shortDesc: r.shortDesc,
      description: r.description,
      images: safeJsonArray(r.images),
      amenities: safeJsonArray(r.amenities),
      featured: r.featured,
      available: r.available,
    };
  } catch {
    const r = STATIC_ROOMS.find((x) => x.slug === slug);
    return r ? { ...r, id: r.slug, available: true } : null;
  }
}
