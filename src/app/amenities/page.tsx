import Image from "next/image";
import {
  Wifi, Coffee, Wind, Sparkles, Waves, ConciergeBell, Car, UtensilsCrossed,
  ShowerHead, ShieldCheck, Tv, Trees, Zap, Globe2,
} from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Amenities — Apart Jardin Tropical",
  description: "Thoughtful amenities and services to make your stay effortless.",
};

const groups = [
  {
    title: "In every room",
    items: [
      { Icon: Wind, label: "Air conditioning" },
      { Icon: Wifi, label: "Starlink Wi-Fi" },
      { Icon: ShowerHead, label: "Rainfall shower" },
      { Icon: Tv, label: "Smart TV" },
      { Icon: Coffee, label: "Coffee & tea" },
      { Icon: ShieldCheck, label: "In-room safe" },
    ],
  },
  {
    title: "On the property",
    items: [
      { Icon: Waves, label: "Outdoor pool" },
      { Icon: Trees, label: "Tropical garden" },
      { Icon: UtensilsCrossed, label: "Breakfast service" },
      { Icon: ConciergeBell, label: "24h concierge" },
      { Icon: Car, label: "Free parking" },
      { Icon: Sparkles, label: "Daily housekeeping" },
    ],
  },
];

export default function AmenitiesPage() {
  return (
    <>
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-24 bg-cream-200">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Your stay</p>
            <h1 className="display-1 mt-6 text-ink max-w-4xl">Amenities & services.</h1>
            <p className="mt-8 max-w-xl text-lg text-ink-muted leading-relaxed">
              Quiet attention to detail, in every corner. Everything you need —
              nothing you don't.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-20">
          {groups.map((g, gi) => (
            <Reveal key={g.title}>
              <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow">0{gi + 1}</p>
                  <h2 className="display-3 mt-4 text-ink">{g.title}</h2>
                </div>

                <div className="lg:col-span-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
                  {g.items.map(({ Icon, label }, i) => (
                    <Reveal key={label} delay={i * 60}>
                      <div className="flex flex-col gap-3">
                        <Icon size={28} strokeWidth={1.4} className="text-gold-600" />
                        <p className="font-serif text-lg text-ink">{label}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STARLINK BAND */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink text-cream px-8 sm:px-14 py-14 sm:py-20 grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-jungle/40 blur-3xl" aria-hidden />

              <div className="relative lg:col-span-7">
                <div className="inline-flex items-center gap-3 rounded-full bg-cream/5 ring-1 ring-cream/15 px-4 py-2">
                  <Wifi size={14} className="text-gold" strokeWidth={1.8} />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-cream/70">Starlink · Powered by SpaceX</span>
                </div>
                <h2 className="display-2 mt-6 text-cream">
                  World-class internet,<br />from low-earth orbit.
                </h2>
                <p className="mt-6 max-w-xl text-cream/70 leading-relaxed text-[15px]">
                  Every room and the entire property are connected through{" "}
                  <span className="text-cream">Starlink satellite internet</span> — fast, reliable
                  and uninterrupted. Stream, video-call, work remotely or stay in touch with home,
                  anywhere on the grounds.
                </p>
              </div>

              <div className="relative lg:col-span-5 grid grid-cols-3 gap-4">
                {[
                  { Icon: Zap, t: "Up to", v: "200 Mbps" },
                  { Icon: Globe2, t: "Global", v: "Coverage" },
                  { Icon: Wifi, t: "24 / 7", v: "Uptime" },
                ].map(({ Icon, t, v }) => (
                  <div key={v} className="rounded-2xl bg-cream/5 ring-1 ring-cream/10 p-5">
                    <Icon size={20} className="text-gold" strokeWidth={1.5} />
                    <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-cream/50">{t}</p>
                    <p className="mt-1 font-serif text-lg text-cream">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Image strip */}
      <section className="pb-28">
        <div className="container-x grid grid-cols-12 gap-4">
          <Reveal className="col-span-12 sm:col-span-8 aspect-[16/9] relative overflow-hidden rounded-2xl group">
            <Image src="/images/highlights/tropical-27.jpg" alt="" fill className="object-cover img-zoom" sizes="66vw" />
          </Reveal>
          <Reveal delay={120} className="col-span-12 sm:col-span-4 aspect-[16/9] relative overflow-hidden rounded-2xl group">
            <Image src="/images/highlights/tropical-37.jpg" alt="" fill className="object-cover img-zoom" sizes="33vw" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
