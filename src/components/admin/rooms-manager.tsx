"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Check, X, Users, Bed, Maximize2 } from "lucide-react";
import type { RoomDTO } from "@/lib/rooms";
import { cn, formatCurrency } from "@/lib/utils";

export function RoomsManager({ initialRooms }: { initialRooms: RoomDTO[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [editing, setEditing] = useState<RoomDTO | null>(null);

  async function save(updated: RoomDTO) {
    setRooms((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
    setEditing(null);
    await fetch(`/api/rooms/${updated.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: updated.name,
        price: Number(updated.price),
        shortDesc: updated.shortDesc,
        description: updated.description,
        capacity: Number(updated.capacity),
        beds: Number(updated.beds),
        size: Number(updated.size),
        available: updated.available,
        featured: updated.featured,
        amenities: updated.amenities,
      }),
    });
  }

  async function toggleAvailable(r: RoomDTO) {
    const updated = { ...r, available: !r.available };
    setRooms((rs) => rs.map((x) => (x.id === r.id ? updated : x)));
    await fetch(`/api/rooms/${r.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ available: updated.available }),
    });
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((r) => (
          <div key={r.id} className="card-soft overflow-hidden flex flex-col">
            <div className="relative aspect-[5/3]">
              <Image src={r.images[0]} alt={r.name} fill sizes="33vw" className="object-cover" />
              <span
                className={cn(
                  "absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ring-1",
                  r.available
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-red-50 text-red-700 ring-red-200"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", r.available ? "bg-emerald-500" : "bg-red-500")} />
                {r.available ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl text-ink">{r.name}</h3>
                  <p className="text-sm text-ink-muted mt-0.5">{formatCurrency(r.price)} / night</p>
                </div>
                {r.featured && (
                  <span className="text-[10px] uppercase tracking-wider text-gold-700 bg-gold/10 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><Users size={12} /> {r.capacity}</span>
                <span className="inline-flex items-center gap-1.5"><Bed size={12} /> {r.beds}</span>
                <span className="inline-flex items-center gap-1.5"><Maximize2 size={12} /> {r.size} m²</span>
              </div>

              <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-2 flex-1">
                {r.shortDesc}
              </p>

              <div className="mt-4 pt-4 border-t border-ink/5 flex gap-2">
                <button onClick={() => setEditing(r)} className="btn-outline flex-1 text-xs py-2">
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => toggleAvailable(r)}
                  className={cn(
                    "btn flex-1 text-xs py-2",
                    r.available
                      ? "bg-cream-200 text-ink hover:bg-cream-300"
                      : "bg-jungle text-cream hover:bg-ink"
                  )}
                >
                  {r.available ? "Mark unavailable" : "Mark available"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <EditDrawer room={editing} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function EditDrawer({
  room,
  onClose,
  onSave,
}: {
  room: RoomDTO;
  onClose: () => void;
  onSave: (r: RoomDTO) => void;
}) {
  const [draft, setDraft] = useState<RoomDTO>(room);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-up" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-cream overflow-y-auto shadow-2xl animate-fade-up"
      >
        <div className="sticky top-0 bg-cream border-b border-ink/5 px-8 py-5 flex items-center justify-between z-10">
          <div>
            <p className="eyebrow">Edit room</p>
            <h3 className="font-serif text-xl text-ink mt-1">{room.name}</h3>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink"><X size={18} /></button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="label">Name</label>
            <input className="field" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price ($/night)</label>
              <input type="number" className="field" value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Capacity</label>
              <input type="number" className="field" value={draft.capacity}
                onChange={(e) => setDraft({ ...draft, capacity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Beds</label>
              <input type="number" className="field" value={draft.beds}
                onChange={(e) => setDraft({ ...draft, beds: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Size (m²)</label>
              <input type="number" className="field" value={draft.size}
                onChange={(e) => setDraft({ ...draft, size: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="label">Short description</label>
            <input className="field" value={draft.shortDesc}
              onChange={(e) => setDraft({ ...draft, shortDesc: e.target.value })} />
          </div>
          <div>
            <label className="label">Long description</label>
            <textarea rows={6} className="field resize-none" value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Amenities (comma separated)</label>
            <input className="field" value={draft.amenities.join(", ")}
              onChange={(e) =>
                setDraft({ ...draft, amenities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              } />
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={draft.available}
                onChange={(e) => setDraft({ ...draft, available: e.target.checked })} />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
              Featured
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-cream border-t border-ink/5 px-8 py-5 flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button onClick={() => onSave(draft)} className="btn-primary flex-1">
            <Check size={14} /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
