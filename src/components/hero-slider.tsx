"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n";

type Slide = {
  src: string;
  alt: string;
  eyebrow: { en: string; fr: string };
  title: { en: React.ReactNode; fr: React.ReactNode };
  location: { en: string; fr: string };
};

const slides: Slide[] = [
  {
    src: "/images/highlights/tropical-18.jpg",
    alt: "Aparthotel Jardin Tropical at night",
    eyebrow: { en: "Aparthotel Jardin Tropical", fr: "Aparthotel Jardin Tropical" },
    title: {
      en: (<>Where the garden<br className="hidden sm:block" /> welcomes you home.</>),
      fr: (<>Là où le jardin<br className="hidden sm:block" /> vous accueille chez vous.</>),
    },
    location: { en: "Bujumbura, Burundi", fr: "Bujumbura, Burundi" },
  },
  {
    src: "/images/highlights/tropical-16.jpg",
    alt: "Lush tropical garden at Jardin Tropical",
    eyebrow: { en: "An intimate retreat", fr: "Un refuge intime" },
    title: {
      en: (<>A garden of calm,<br className="hidden sm:block" /> moments to remember.</>),
      fr: (<>Un jardin de quiétude,<br className="hidden sm:block" /> des moments à garder.</>),
    },
    location: { en: "Mutanga Sud · Bujumbura", fr: "Mutanga Sud · Bujumbura" },
  },
  {
    src: "/images/highlights/tropical-38.jpg",
    alt: "Elegant interior of an apartment at Jardin Tropical",
    eyebrow: { en: "Refined comfort", fr: "Un confort raffiné" },
    title: {
      en: (<>Apartments crafted<br className="hidden sm:block" /> for slow living.</>),
      fr: (<>Des appartements pensés<br className="hidden sm:block" /> pour le « slow living ».</>),
    },
    location: { en: "Six private accommodations", fr: "Six hébergements privés" },
  },
  {
    src: "/images/highlights/tropical-55.jpg",
    alt: "Private terrace overlooking the tropical garden",
    eyebrow: { en: "Your own terrace", fr: "Votre propre terrasse" },
    title: {
      en: (<>Mornings under<br className="hidden sm:block" /> the mango trees.</>),
      fr: (<>Les matins sous<br className="hidden sm:block" /> les manguiers.</>),
    },
    location: { en: "Tropical garden views", fr: "Vue sur le jardin tropical" },
  },
];

const AUTOPLAY_MS = 6500;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = useT();

  const total = slides.length;
  const goTo = (i: number) => setIndex((i + total) % total);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const active = slides[index];

  return (
    <section
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-transform duration-[7000ms] ease-out ${
              i === index ? "scale-105" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/30 to-ink/75 pointer-events-none" />

      {/* Content */}
      <div className="relative h-full container-x flex flex-col items-center justify-center text-center text-cream">
        <div key={`eyebrow-${index}`} className="animate-[fadeUp_900ms_ease-out_both]">
          <div className="flex items-center gap-5 sm:gap-8 text-cream/80">
            <span className="hidden sm:block h-px w-24 md:w-40 lg:w-56 bg-cream/40" />
            <span className="font-serif italic text-base sm:text-lg tracking-wide whitespace-nowrap">
              {t(active.eyebrow.en, active.eyebrow.fr)}
            </span>
            <span className="hidden sm:block h-px w-24 md:w-40 lg:w-56 bg-cream/40" />
          </div>
        </div>

        <h1
          key={`title-${index}`}
          className="display-1 mt-8 sm:mt-10 max-w-5xl font-serif animate-[fadeUp_1100ms_ease-out_both]"
        >
          {t(active.title.en, active.title.fr)}
        </h1>

        <p
          key={`loc-${index}`}
          className="mt-8 inline-flex items-center gap-2 text-sm sm:text-base text-cream/85 animate-[fadeUp_1300ms_ease-out_both]"
        >
          <MapPin size={16} className="text-cream/70" strokeWidth={1.6} />
          {t(active.location.en, active.location.fr)}
        </p>

        <div className="animate-[fadeUp_1500ms_ease-out_both]">
          <Link
            href="/booking"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-cream text-ink px-7 py-3.5 text-sm sm:text-base font-medium shadow-lg shadow-ink/20 hover:bg-white transition-colors"
          >
            {t("Reserve this Stay", "Réserver ce séjour")}
            <span className="grid place-items-center w-7 h-7 rounded-full bg-ink text-cream">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>

      {/* Side arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="group absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cream/10 backdrop-blur-md ring-1 ring-cream/30 text-cream hover:bg-cream hover:text-ink transition-all"
      >
        <ArrowLeft size={18} strokeWidth={1.6} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="group absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cream/10 backdrop-blur-md ring-1 ring-cream/30 text-cream hover:bg-cream hover:text-ink transition-all"
      >
        <ArrowRight size={18} strokeWidth={1.6} />
      </button>

      {/* Bottom controls: counter + progress dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-5 sm:gap-7 text-cream">
        <span className="font-serif text-sm tabular-nums text-cream/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative h-[2px] w-10 sm:w-14 bg-cream/25 overflow-hidden"
            >
              <span
                className={`absolute inset-y-0 left-0 bg-cream ${
                  i === index && !isPaused
                    ? "animate-[progress_6500ms_linear_forwards]"
                    : i < index
                    ? "w-full"
                    : "w-0"
                }`}
                style={
                  i === index && isPaused
                    ? { width: "100%", transition: "none" }
                    : undefined
                }
              />
            </button>
          ))}
        </div>
        <span className="font-serif text-sm tabular-nums text-cream/50">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Local keyframes */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
