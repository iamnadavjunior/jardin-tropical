"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { formatCurrency } from "@/lib/utils";
import type { RoomDTO } from "@/lib/rooms";

const INITIAL = 2;

export function RoomsExplorer({ rooms }: { rooms: RoomDTO[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rooms : rooms.slice(0, INITIAL);
  const hasMore = rooms.length > INITIAL;

  return (
    <>
      <div className="mt-12 space-y-6">
        {visible.map((r, i) => {
          const [a, b, c] = [
            r.images[0],
            r.images[1] ?? r.images[0],
            r.images[2] ?? r.images[1] ?? r.images[0],
          ];
          return (
            <Reveal key={r.slug} delay={i * 60}>
              <article className="bg-cream rounded-3xl p-4 sm:p-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
                <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 h-[420px] sm:h-[520px]">
                  <div className="relative overflow-hidden rounded-2xl group">
                    <Image src={a} alt={r.name} fill sizes="(min-width:1024px) 35vw, 50vw" className="object-cover img-zoom" />
                  </div>
                  <div className="grid grid-rows-2 gap-3 sm:gap-4">
                    <div className="relative overflow-hidden rounded-2xl group">
                      <Image src={b} alt="" fill sizes="(min-width:1024px) 18vw, 25vw" className="object-cover img-zoom" />
                    </div>
                    <div className="relative overflow-hidden rounded-2xl group">
                      <Image src={c} alt="" fill sizes="(min-width:1024px) 18vw, 25vw" className="object-cover img-zoom" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between p-2 sm:p-4 lg:p-6">
                  <div>
                    <h3 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">{r.name}</h3>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm text-ink-muted">
                      <Users size={14} /> Up to {r.capacity} Guests · {r.beds} Bed{r.beds > 1 ? "s" : ""} · {r.size} m²
                    </div>
                    <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{r.shortDesc}</p>
                  </div>

                  <div className="mt-8">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl ring-1 ring-ink/10 px-5 py-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">Best Rate</p>
                        <p className="mt-2 font-serif text-2xl text-ink">
                          {formatCurrency(r.price)}
                          <span className="text-xs font-sans text-ink-muted font-normal"> /night</span>
                        </p>
                      </div>
                      <div className="rounded-2xl ring-1 ring-ink/10 px-5 py-4 flex flex-col">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">Status</p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {r.available ? "Available" : "On request"}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-ink-muted">
                      For 2 nights, 1 refundable room. Incl. taxes &amp; fees.
                    </p>
                    <Link
                      href={`/booking?room=${r.slug}`}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream px-6 py-4 text-sm tracking-wide hover:bg-jungle transition"
                    >
                      Reserve {r.name} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm text-ink ring-1 ring-ink/15 hover:ring-ink/30 transition"
          >
            {expanded ? "Show less" : `Show ${rooms.length - INITIAL} more rooms`}
            <ChevronDown
              size={15}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </>
  );
}
