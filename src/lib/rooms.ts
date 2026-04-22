import { prisma } from "./prisma";
import { STATIC_ROOMS, type StaticRoom } from "@/data/rooms";
import { safeJsonArray } from "./utils";

export type RoomDTO = StaticRoom & {
  id: string;
  available: boolean;
  occupiedTonight?: boolean;
  nextFreeDate?: string | null;
};

const ACTIVE_STATUSES = ["BOOKED", "CONFIRMED", "CHECKED_IN"] as const;

async function buildOccupancyMap(): Promise<Record<string, Date>> {
  const today = new Date(new Date().toDateString());
  try {
    const active = await prisma.booking.findMany({
      where: {
        status: { in: ACTIVE_STATUSES as unknown as string[] },
        checkIn: { lte: today },
        checkOut: { gt: today },
      },
      select: { roomId: true, checkOut: true },
    });
    const map: Record<string, Date> = {};
    for (const b of active) {
      if (!map[b.roomId] || map[b.roomId] < b.checkOut) map[b.roomId] = b.checkOut;
    }
    return map;
  } catch {
    return {};
  }
}

export async function getAllRooms(): Promise<RoomDTO[]> {
  try {
    const [rows, occupancy] = await Promise.all([
      prisma.room.findMany({ orderBy: [{ featured: "desc" }, { price: "desc" }] }),
      buildOccupancyMap(),
    ]);
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => {
      const nextFree = occupancy[r.id];
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
        occupiedTonight: !!nextFree,
        nextFreeDate: nextFree ? nextFree.toISOString() : null,
      };
    });
  } catch {
    return STATIC_ROOMS.map((r) => ({
      ...r,
      id: r.slug,
      available: true,
      occupiedTonight: false,
      nextFreeDate: null,
    }));
  }
}

export async function getRoomBySlug(slug: string): Promise<RoomDTO | null> {
  try {
    const r = await prisma.room.findUnique({ where: { slug } });
    if (!r) throw new Error("not found");
    const occupancy = await buildOccupancyMap();
    const nextFree = occupancy[r.id];
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
      occupiedTonight: !!nextFree,
      nextFreeDate: nextFree ? nextFree.toISOString() : null,
    };
  } catch {
    const r = STATIC_ROOMS.find((x) => x.slug === slug);
    return r
      ? { ...r, id: r.slug, available: true, occupiedTonight: false, nextFreeDate: null }
      : null;
  }
}