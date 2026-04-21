import { AdminShell } from "@/components/admin/admin-shell";
import { RoomsManager } from "@/components/admin/rooms-manager";
import { getAllRooms } from "@/lib/rooms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminRoomsPage() {
  const rooms = await getAllRooms();
  return (
    <AdminShell>
      <div>
        <p className="eyebrow">Inventory</p>
        <h1 className="display-2 mt-3 text-ink">Rooms.</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Update pricing, descriptions, and availability. Changes appear instantly on the website.
        </p>
      </div>

      <div className="mt-10">
        <RoomsManager initialRooms={rooms} />
      </div>
    </AdminShell>
  );
}
