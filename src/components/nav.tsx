"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Overview" },
  { href: "/rooms", label: "Rooms" },
  { href: "/amenities", label: "Amenities" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          <span className="hidden sm:inline">Apart Jardin Tropical</span>
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
          <Link
            href="/booking"
            className={cn(
              "btn rounded-full px-5 py-2.5 text-sm transition-all",
              transparent
                ? "bg-cream text-ink hover:bg-white"
                : "bg-ink text-cream hover:bg-jungle"
            )}
          >
            Book a stay
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
          </nav>
        </div>
      )}
    </header>
  );
}
