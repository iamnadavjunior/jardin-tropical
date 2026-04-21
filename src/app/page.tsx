import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Wind, Sparkles, Users, CalendarDays, ChevronDown, SlidersHorizontal, Wifi } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { RoomsExplorer } from "@/components/rooms-explorer";
import { getAllRooms } from "@/lib/rooms";
import { formatCurrency } from "@/lib/utils";

export default async function OverviewPage() {
  const rooms = await getAllRooms();

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <Image
          src="/images/highlights/tropical-18.jpg"
          alt="Apart Jardin Tropical at night"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/70" />

        <div className="relative h-full container-x flex flex-col justify-end pb-12 sm:pb-16 text-cream">
          <Reveal delay={200}>
            <h1 className="display-1 max-w-5xl">
              When night falls,<br />the garden glows.
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-cream/80 leading-relaxed">
              Six lantern-lit rooms tucked in a tropical garden — slow mornings,
              warm evenings, and the quiet luxury of being unhurried.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
              <Link href="/booking" className="btn-gold">
                Reserve your stay <ArrowRight size={16} />
              </Link>
              <Link href="/rooms" className="text-sm text-cream/90 underline-offset-4 hover:underline">
                See all rooms
              </Link>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl border-t border-cream/20 pt-6">
              {[
                { k: "Six", v: "Curated rooms" },
                { k: "100%", v: "Garden setting" },
                { k: "24/7", v: "Concierge" },
                { k: "5.0", v: "Guest rating" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-serif text-3xl text-cream">{s.k}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cream/60">{s.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60 text-[10px] uppercase tracking-[0.3em]">
          Scroll
          <span className="block w-px h-10 bg-cream/40 animate-pulse" />
        </div>
      </section>

      {/* INTRO / STORY */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-16 lg:grid-cols-12 items-start">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Our Story</p>
            <h2 className="display-2 mt-6 text-ink">
              An intimate garden hotel,<br />six rooms, one quiet world.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
            <p className="text-lg leading-relaxed text-ink-muted">
              <span className="font-serif text-ink">Apart Jardin Tropical</span> is a small,
              independent hotel set within a mature tropical garden. Six rooms, each named after a
              capital city, are scattered around the grounds — each one private, each one different.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">
              Mornings begin with birdsong and freshly pressed coffee under the mango trees. Days
              unfold as you choose — explore the city, swim in the pool, or simply read in the
              shade. Evenings are made for unhurried dinners and the soft glow of lanterns.
            </p>
            <Link href="/rooms" className="mt-10 inline-flex items-center gap-2 text-sm tracking-wide text-ink border-b border-ink pb-1 hover:text-gold-600 hover:border-gold-600 transition-colors">
              Discover the rooms <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* EXPLORE ROOMS — Nyack-style */}
      <section className="py-24 sm:py-32 bg-cream-200">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h2 className="display-2 text-ink leading-[1.05]">
                Explore Our<br />Rooms &amp; Suites
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm text-ink ring-1 ring-ink/10 hover:ring-ink/20 transition">
                  <CalendarDays size={15} className="text-ink-muted" />
                  <span className="font-medium">Apr 22 &nbsp;–&nbsp; Apr 24</span>
                  <ChevronDown size={14} className="text-ink-muted" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm text-ink ring-1 ring-ink/10 hover:ring-ink/20 transition">
                  <Users size={15} className="text-ink-muted" />
                  <span className="font-medium">1 Guest</span>
                  <ChevronDown size={14} className="text-ink-muted" />
                </button>
                <button className="h-11 w-11 rounded-full bg-cream ring-1 ring-ink/10 hover:ring-ink/20 transition inline-flex items-center justify-center text-ink-muted">
                  <SlidersHorizontal size={15} />
                </button>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 space-y-6">
            <RoomsExplorer rooms={rooms} />
          </div>
        </div>
      </section>

      {/* AMENITIES TEASER */}
      <section className="py-28 sm:py-32">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Amenities</p>
                <h2 className="display-2 mt-4 max-w-2xl text-ink">Thoughtful touches throughout your stay.</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-4 py-2">
                <Wifi size={13} className="text-gold" strokeWidth={1.8} />
                <span className="text-[10px] uppercase tracking-[0.22em] text-cream/70">Starlink Wi-Fi</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Wifi, t: "Starlink internet", d: "Fast, reliable, world-class connectivity in every room and across the garden." },
              { Icon: Coffee, t: "Daily breakfast", d: "Fresh fruit, breads, eggs and locally roasted coffee." },
              { Icon: Wind, t: "Climate control", d: "Quiet air conditioning and ceiling fans in every room." },
              { Icon: Sparkles, t: "Daily housekeeping", d: "Soft cottons, fresh flowers, gentle care every day." },
            ].map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 80}>
                <div className="flex flex-col gap-4">
                  <Icon size={28} className="text-gold-600" strokeWidth={1.5} />
                  <h3 className="font-serif text-xl text-ink">{t}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16">
            <Link href="/amenities" className="inline-flex items-center gap-2 text-sm tracking-wide border-b border-ink pb-1 hover:text-gold-600 hover:border-gold-600 transition-colors">
              See all amenities <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <Image src="/images/highlights/tropical-20.jpg" alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative container-x text-center text-cream">
          <Reveal>
            <p className="eyebrow text-gold mb-6">Stay with us</p>
            <h2 className="display-1 max-w-3xl mx-auto">Your garden retreat awaits.</h2>
            <p className="mt-6 text-lg text-cream/80 max-w-xl mx-auto">
              Reserve in under a minute — instant confirmation, no hidden fees.
            </p>
            <Link href="/booking" className="btn-gold mt-10">
              Begin your booking <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
