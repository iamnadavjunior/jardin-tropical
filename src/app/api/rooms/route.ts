import { NextResponse } from "next/server";
import { getAllRooms } from "@/lib/rooms";

export async function GET() {
  const rooms = await getAllRooms();
  return NextResponse.json(rooms);
}
