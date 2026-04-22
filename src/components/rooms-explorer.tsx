"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import type { RoomDTO } from "@/lib/rooms";

const INITIAL = 2;

export function RoomsExplorer({ rooms }: { rooms: RoomDTO[] }) {
  const [expanded, setExpanded] = useState(false);
  const t = useT();
  const availableRooms = rooms.filter((r) => r.available);
  const visible = expanded ? availableRooms : availableRooms.slice(0, INITIAL);
  const hasMore = availableRooms.length > INITIAL;

  if (availableRooms.length === 0) {
    return (
      <Reveal>
        <div className="mt-12 rounded-3xl bg-cream px-8 py-20 sm:py-28 text-center">
          <p className="font-serif text-2xl sm:text-3xl text-ink">
            {t("Nothing available for these dates / this stay.", "Rien de disponible pour ces dates / ce séjour.")}
          </p>
          <p className="mt-4 text-sm sm:text-base text-ink-muted">
            {t("Adjust your dates, or explore nearby properties.", "Modifiez vos dates ou explorez les propriétés voisines.")}
          </p>
        </div>
      </Reveal>
    );
  }

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
                  <Link href={`/rooms/${r.slug}`} className="relative overflow-hidden rounded-2xl group block" aria-label={`View ${r.name}`}>
                    <Image src={a} alt={r.name} fill sizes="(min-width:1024px) 35vw, 50vw" className="object-cover img-zoom" />
                  </Link>
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
                    <Link href={`/rooms/${r.slug}`} className="inline-block group/title">
                      <h3 className="font-serif text-3xl sm:text-4xl text-ink leading-tight group-hover/title:text-gold-600 transition-colors">{r.name}</h3>
                    </Link>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm text-ink-muted">
                      <Users size={14} /> {t(`Up to ${r.capacity} Guests`, `Jusqu’à ${r.capacity} personnes`)} · {r.beds} {t(r.beds > 1 ? "Beds" : "Bed", r.beds > 1 ? "Lits" : "Lit")} · {r.size} m²
                    </div>
                    <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{r.shortDesc}</p>
                  </div>

                  <div className="mt-8">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl ring-1 ring-ink/10 px-5 py-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">{t("Best Rate", "Meilleur tarif")}</p>
                        <p className="mt-2 font-serif text-2xl text-ink">
                          {formatCurrency(r.price)}
                          <span className="text-xs font-sans text-ink-muted font-normal"> {t("/night", "/nuit")}</span>
                        </p>
                      </div>
                      <div className="rounded-2xl ring-1 ring-ink/10 px-5 py-4 flex flex-col">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">{t("Status", "Statut")}</p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {r.available ? t("Available", "Disponible") : t("On request", "Sur demande")}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-ink-muted">
                      {t("For 2 nights, 1 refundable room. Incl. taxes & fees.", "Pour 2 nuits, 1 chambre remboursable. Taxes & frais inclus.")}
                    </p>
                    <Link
                      href={`/booking?room=${r.slug}`}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream px-6 py-4 text-sm tracking-wide hover:bg-jungle transition"
                    >
                      {t(`Reserve ${r.name}`, `Réserver ${r.name}`)} <ArrowRight size={14} />
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
            {expanded ? t("Show less", "Voir moins") : t(`Show ${availableRooms.length - INITIAL} more rooms`, `Voir ${availableRooms.length - INITIAL} autres chambres`)}
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
