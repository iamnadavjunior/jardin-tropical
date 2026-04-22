"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Marquee } from "./marquee";
import { useT } from "@/lib/i18n";

export function Footer() {
  const pathname = usePathname();
  const t = useT();
  if (pathname.startsWith("/admin")) return null;

  const cols: Array<{ title: string; links: { href: string; label: string }[] }> = [
    {
      title: t("Stay", "Séjour"),
      links: [
        { href: "/rooms", label: t("Rooms & Suites", "Chambres & Suites") },
        { href: "/amenities", label: t("Amenities", "Services") },
        { href: "/booking", label: t("Book a stay", "Réserver") },
      ],
    },
    {
      title: t("Hotel", "Hôtel"),
      links: [
        { href: "/", label: t("About us", "À propos") },
        { href: "/contact", label: t("Contact", "Contact") },
        { href: "/contact#location", label: t("Location", "Emplacement") },
      ],
    },
    {
      title: t("Connect", "Contact"),
      links: [
        { href: "mailto:info@jtropical.com", label: "info@jtropical.com" },
        { href: "tel:+25776718975", label: "+257 76 718 975" },
        { href: "https://wa.me/25776718975", label: "WhatsApp" },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-cream/80">
      <Marquee />

      <div className="container-x py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-serif text-2xl text-cream tracking-tightish">
              Aparthotel Jardin Tropical
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
              {t(
                "An intimate garden hotel of six rooms — slow mornings, lush surroundings, refined comfort.",
                "Un hôtel-jardin intime de six chambres — matins paisibles, écrin de verdure, confort raffiné."
              )}
            </p>
            <Link
              href="/booking"
              className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-1 text-sm uppercase tracking-[0.18em] text-gold transition-colors hover:text-cream hover:border-cream"
            >
              {t("Reserve a stay →", "Réserver un séjour →")}
            </Link>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cream/40 mb-5">
                {c.title}
              </p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-cream/75 hover:text-cream transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-xs text-cream/40">
          <p>
            © {new Date().getFullYear()} Aparthotel Jardin Tropical.{" "}
            {t("All rights reserved.", "Tous droits réservés.")}
          </p>
          <p>
            {t("Designed by", "Conçu par")}{" "}
            <a
              href="https://flexostudio.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-cream transition-colors tracking-[0.18em] uppercase"
            >
              Flexo Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}