"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, Bed, Maximize2 } from "lucide-react";
import type { RoomDTO } from "@/lib/rooms";
import { formatCurrency, cn } from "@/lib/utils";

export function RoomCard({ room }: { room: RoomDTO }) {
  const [idx, setIdx] = useState(0);
  const total = room.images.length;
  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i + 1) % total);
  };

  return (
    <article className="group grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14 py-10 border-t border-ink/10 first:border-t-0">
      {/* Gallery */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] lg:aspect-[5/4] bg-cream-200">
        {room.images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${room.name} — image ${i + 1}`}
            fill
            sizes="(min-width:1024px) 60vw, 100vw"
            className={cn(
              "object-cover img-zoom transition-opacity duration-700 ease-out-soft",
              i === idx ? "opacity-100" : "opacity-0"
            )}
            priority={i === 0}
          />
        ))}
        {/* Overlay arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-cream/90 text-ink opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-cream/90 text-ink opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {room.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setIdx(i);
                  }}
                  aria-label={`Image ${i + 1}`}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === idx ? "w-6 bg-cream" : "w-2 bg-cream/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
        {room.featured && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-cream/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink">
            <span className="w-1 h-1 rounded-full bg-gold" /> Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between gap-8">
        <div>
          <p className="eyebrow">Room</p>
          <h3 className="display-3 mt-3 text-ink">{room.name}</h3>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2"><Users size={14} /> Up to {room.capacity} guests</span>
            <span className="inline-flex items-center gap-2"><Bed size={14} /> {room.beds} bed</span>
            <span className="inline-flex items-center gap-2"><Maximize2 size={14} /> {room.size} m²</span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{room.shortDesc}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {room.amenities.slice(0, 5).map((a) => (
              <li key={a} className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-end justify-between gap-4 pt-6 border-t border-ink/10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">From</p>
            <p className="mt-1 font-serif text-3xl text-ink">
              {formatCurrency(room.price)} <span className="text-base text-ink-muted">/ night</span>
            </p>
          </div>
          <Link href={`/booking?room=${room.slug}`} className="btn-primary">
            Reserve
          </Link>
        </div>
      </div>
    </article>
  );
}
