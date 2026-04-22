import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Users, Bed, Maximize2, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getRoomBySlug, getAllRooms } from "@/lib/rooms";
import { formatCurrency } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "Room not found — Aparthotel Jardin Tropical" };
  return {
    title: `${room.name} — Aparthotel Jardin Tropical`,
    description: room.shortDesc,
  };
}

export default async function RoomDetailPage({ params }: Params) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) notFound();

  const all = await getAllRooms();
  const others = all.filter((r) => r.slug !== room.slug).slice(0, 3);
  const [hero, ...rest] = room.images;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70svh] min-h-[520px] w-full overflow-hidden">
        <Image
          src={hero}
          alt={room.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/70" />
        <div className="relative h-full container-x flex flex-col justify-end pb-12 sm:pb-16 text-cream">
          <Reveal>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cream/80 hover:text-cream"
            >
              <ArrowLeft size={14} /> All rooms
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow text-cream/70 mt-6">Room</p>
            <h1 className="display-1 mt-4 max-w-4xl">{room.name}</h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-cream/85">
              <span className="inline-flex items-center gap-2"><Users size={14} /> Up to {room.capacity} guests</span>
              <span className="inline-flex items-center gap-2"><Bed size={14} /> {room.beds} bed{room.beds > 1 ? "s" : ""}</span>
              <span className="inline-flex items-center gap-2"><Maximize2 size={14} /> {room.size} m²</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          {/* Description */}
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">About this room</p>
            <h2 className="display-2 mt-6 text-ink">A quiet corner of the garden.</h2>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              {room.description}
            </p>

            <h3 className="font-serif text-2xl text-ink mt-14">In this room</h3>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {room.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm text-ink-muted">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-cream-200 text-gold-600">
                    <Check size={13} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Booking card */}
          <Reveal delay={120} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 rounded-3xl bg-cream-200 p-8">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">Best Rate</p>
              <p className="mt-3 font-serif text-4xl text-ink">
                {formatCurrency(room.price)}
                <span className="text-base font-sans text-ink-muted font-normal"> /night</span>
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-ink">
                <span className={`h-1.5 w-1.5 rounded-full ${room.available ? "bg-emerald-500" : "bg-amber-500"}`} />
                {room.available ? "Available" : "On request"}
              </div>
              <p className="mt-6 text-sm text-ink-muted leading-relaxed">
                Free cancellation up to 48h before check-in. Includes taxes and fees.
              </p>
              {room.available ? (
                <Link
                  href={`/booking?room=${room.slug}`}
                  className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream px-6 py-4 text-sm tracking-wide hover:bg-jungle transition"
                >
                  Reserve {room.name} <ArrowRight size={14} />
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream px-6 py-4 text-sm tracking-wide hover:bg-jungle transition"
                >
                  Enquire about this room <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      {rest.length > 0 && (
        <section className="pb-24">
          <div className="container-x grid gap-4 sm:gap-6 sm:grid-cols-2">
            {rest.map((src, i) => (
              <Reveal key={src} delay={i * 80}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={`${room.name} — image ${i + 2}`}
                    fill
                    sizes="(min-width:640px) 50vw, 100vw"
                    className="object-cover img-zoom"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Other rooms */}
      {others.length > 0 && (
        <section className="py-20 sm:py-28 bg-cream-200">
          <div className="container-x">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <h2 className="display-2 text-ink">Other rooms you might like.</h2>
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-2 text-sm tracking-wide text-ink border-b border-ink pb-1 hover:text-gold-600 hover:border-gold-600 transition-colors"
                >
                  View all rooms <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((r, i) => (
                <Reveal key={r.slug} delay={i * 80}>
                  <Link href={`/rooms/${r.slug}`} className="group block rounded-3xl bg-cream overflow-hidden">
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Image
                        src={r.images[0]}
                        alt={r.name}
                        fill
                        sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover img-zoom"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl text-ink group-hover:text-gold-600 transition-colors">{r.name}</h3>
                      <p className="mt-2 text-sm text-ink-muted">{r.shortDesc}</p>
                      <p className="mt-4 font-serif text-lg text-ink">
                        {formatCurrency(r.price)} <span className="text-sm text-ink-muted">/night</span>
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
