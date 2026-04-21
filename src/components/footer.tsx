"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Marquee } from "./marquee";

const cols: Array<{ title: string; links: { href: string; label: string }[] }> = [
  {
    title: "Stay",
    links: [
      { href: "/rooms", label: "Rooms & Suites" },
      { href: "/amenities", label: "Amenities" },
      { href: "/booking", label: "Book a stay" },
    ],
  },
  {
    title: "Hotel",
    links: [
      { href: "/", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/contact#location", label: "Location" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "mailto:hello@jardintropical.com", label: "hello@jardintropical.com" },
      { href: "tel:+1234567890", label: "+1 (234) 567-890" },
      { href: "https://wa.me/1234567890", label: "WhatsApp" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="bg-ink text-cream/80">
      <Marquee />

      <div className="container-x py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-serif text-2xl text-cream tracking-tightish">
              Apart Jardin Tropical
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
              An intimate garden hotel of six rooms — slow mornings, lush surroundings, refined comfort.
            </p>
            <Link
              href="/booking"
              className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-1 text-sm uppercase tracking-[0.18em] text-gold transition-colors hover:text-cream hover:border-cream"
            >
              Reserve a stay →
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
          <p>© {new Date().getFullYear()} Apart Jardin Tropical. All rights reserved.</p>
          <p>
            Designed by{" "}
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
