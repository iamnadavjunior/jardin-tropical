import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Wind, Sparkles, Wifi } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { RoomsExplorer } from "@/components/rooms-explorer";
import { HeroSlider } from "@/components/hero-slider";
import { getAllRooms } from "@/lib/rooms";
import { T } from "@/lib/i18n";

export default async function OverviewPage() {
  const rooms = await getAllRooms();

  return (
    <>
      {/* HERO */}
      <HeroSlider />

      {/* INTRO / STORY */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-16 lg:grid-cols-12 items-start">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow"><T en="Our Story" fr="Notre Histoire" /></p>
            <h2 className="display-2 mt-6 text-ink">
              <T
                en={<>An intimate garden hotel,<br />six rooms, one quiet world.</>}
                fr={<>Un hôtel-jardin intime,<br />six chambres, un monde paisible.</>}
              />
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
            <p className="text-lg leading-relaxed text-ink-muted">
              <T
                en={<><span className="font-serif text-ink">Aparthotel Jardin Tropical</span> is a small, independent hotel set within a mature tropical garden. Six rooms, each named after a capital city, are scattered around the grounds — each one private, each one different.</>}
                fr={<><span className="font-serif text-ink">Aparthotel Jardin Tropical</span> est un petit hôtel indépendant niché dans un jardin tropical luxuriant. Six chambres, chacune portant le nom d’une capitale, sont réparties dans le domaine — chacune privée, chacune différente.</>}
              />
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">
              <T
                en={<>Mornings begin with birdsong and freshly pressed coffee under the mango trees. Days unfold as you choose — explore the city, stroll through the garden, or simply read in the shade. Evenings are made for unhurried dinners and the soft glow of lanterns.</>}
                fr={<>Les matins commencent par le chant des oiseaux et un café fraîchement préparé sous les manguiers. Les journées se déroulent à votre rythme — découvrez la ville, flânez dans le jardin, ou lisez simplement à l’ombre. Les soirées sont faites pour les dîners sans hâte et la douce lueur des lanternes.</>}
              />
            </p>
            <Link href="/rooms" className="mt-10 inline-flex items-center gap-2 text-sm tracking-wide text-ink border-b border-ink pb-1 hover:text-gold-600 hover:border-gold-600 transition-colors">
              <T en="Discover the rooms" fr="Découvrir les chambres" /> <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* EXPLORE ROOMS — Nyack-style */}
      <section className="py-24 sm:py-32 bg-cream-200">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h2 className="display-2 text-ink leading-[1.05] whitespace-nowrap">
                <T en="Explore Our Rooms" fr="Découvrez Nos Chambres" />
              </h2>
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
                <p className="eyebrow"><T en="Amenities" fr="Services" /></p>
                <h2 className="display-2 mt-4 max-w-2xl text-ink"><T en="Thoughtful touches throughout your stay." fr="Des attentions raffinées tout au long de votre séjour." /></h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-4 py-2">
                <Wifi size={13} className="text-gold" strokeWidth={1.8} />
                <span className="text-[10px] uppercase tracking-[0.22em] text-cream/70">Starlink Wi-Fi</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Wifi, t: { en: "Starlink internet", fr: "Internet Starlink" }, d: { en: "Fast, reliable, world-class connectivity in every room and across the garden.", fr: "Une connexion rapide et fiable dans chaque chambre et à travers le jardin." } },
              { Icon: Coffee, t: { en: "Daily breakfast", fr: "Petit-déjeuner quotidien" }, d: { en: "Fresh fruit, breads, eggs and locally roasted coffee.", fr: "Fruits frais, pains, œufs et café torréfié localement." } },
              { Icon: Wind, t: { en: "Climate control", fr: "Climatisation" }, d: { en: "Quiet air conditioning and ceiling fans in every room.", fr: "Climatisation silencieuse et ventilateurs de plafond dans chaque chambre." } },
              { Icon: Sparkles, t: { en: "Daily housekeeping", fr: "Ménage quotidien" }, d: { en: "Soft cottons, fresh flowers, gentle care every day.", fr: "Cotons doux, fleurs fraîches, soin attentif chaque jour." } },
            ].map(({ Icon, t, d }, i) => (
              <Reveal key={t.en} delay={i * 80}>
                <div className="flex flex-col gap-4">
                  <Icon size={28} className="text-gold-600" strokeWidth={1.5} />
                  <h3 className="font-serif text-xl text-ink"><T en={t.en} fr={t.fr} /></h3>
                  <p className="text-sm leading-relaxed text-ink-muted"><T en={d.en} fr={d.fr} /></p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16">
            <Link href="/amenities" className="inline-flex items-center gap-2 text-sm tracking-wide border-b border-ink pb-1 hover:text-gold-600 hover:border-gold-600 transition-colors">
              <T en="See all amenities" fr="Voir tous les services" /> <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <Image src="/images/highlights/tropical-28.jpg" alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative container-x text-center text-cream">
          <Reveal>
            <p className="eyebrow text-gold mb-6"><T en="Stay with us" fr="Séjournez chez nous" /></p>
            <h2 className="display-1 max-w-3xl mx-auto"><T en="Your garden retreat awaits." fr="Votre refuge tropical vous attend." /></h2>
            <p className="mt-6 text-lg text-cream/80 max-w-xl mx-auto">
              <T en="Reserve in under a minute — instant confirmation, no hidden fees." fr="Réservez en moins d’une minute — confirmation instantanée, sans frais cachés." />
            </p>
            <Link href="/booking" className="btn-gold mt-10">
              <T en="Begin your booking" fr="Commencer votre réservation" /> <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
