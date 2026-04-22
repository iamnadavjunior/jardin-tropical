"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang, useT } from "@/lib/i18n";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, toggle } = useLang();
  const t = useT();

  const links = [
    { href: "/", label: t("Home", "Accueil") },
    { href: "/rooms", label: t("Rooms", "Chambres") },
    { href: "/amenities", label: t("Amenities", "Services") },
    { href: "/contact", label: t("Contact", "Contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on admin routes
  if (pathname.startsWith("/admin")) return null;

  // Hero pages have a transparent nav until scrolled
  const isHomeHero = pathname === "/";
  const transparent = isHomeHero && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-soft",
        transparent
          ? "bg-transparent"
          : "bg-cream/85 backdrop-blur-xl border-b border-ink/5"
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className={cn(
            "font-serif text-lg tracking-tightish transition-colors",
            transparent ? "text-cream" : "text-ink"
          )}
        >
          <span className="hidden sm:inline">Aparthotel Jardin Tropical</span>
          <span className="sm:hidden">Jardin Tropical</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative text-sm tracking-wide transition-colors duration-300",
                  transparent
                    ? "text-cream/90 hover:text-cream"
                    : "text-ink-muted hover:text-ink",
                  active && (transparent ? "text-cream" : "text-ink")
                )}
              >
                {l.label}
                {active && (
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-1/2 h-px w-6 -translate-x-1/2",
                      transparent ? "bg-cream" : "bg-gold"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={t("Switch language", "Changer de langue")}
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs tracking-[0.18em] uppercase transition-colors ring-1",
              transparent
                ? "text-cream/90 ring-cream/30 hover:bg-cream/10"
                : "text-ink ring-ink/15 hover:bg-ink/5"
            )}
          >
            <Globe size={13} strokeWidth={1.6} />
            {lang === "en" ? "FR" : "EN"}
          </button>
          <Link
            href="/booking"
            className={cn(
              "btn rounded-full px-5 py-2.5 text-sm transition-all",
              transparent
                ? "bg-cream text-ink hover:bg-white"
                : "bg-ink text-cream hover:bg-jungle"
            )}
          >
            {t("Book a stay", "Réserver")}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "md:hidden p-2 -mr-2",
              transparent ? "text-cream" : "text-ink"
            )}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ink/5 bg-cream/95 backdrop-blur-xl">
          <nav className="container-x flex flex-col py-6 gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-serif text-2xl text-ink hover:text-gold-600"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggle();
                setOpen(false);
              }}
              className="mt-4 inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-xs tracking-[0.18em] uppercase ring-1 ring-ink/15 text-ink"
            >
              <Globe size={13} strokeWidth={1.6} />
              {lang === "en" ? "Français" : "English"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
