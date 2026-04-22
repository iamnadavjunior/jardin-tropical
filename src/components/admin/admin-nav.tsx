"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, BedDouble, Globe, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
  { href: "/admin/finance", label: "Finance", Icon: Wallet },
  { href: "/admin/rooms", label: "Rooms", Icon: BedDouble },
  { href: "/", label: "View website", Icon: Globe, external: true },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {items.map(({ href, label, Icon, exact, external }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            target={external ? "_blank" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              active
                ? "bg-cream/10 text-cream"
                : "text-cream/65 hover:bg-cream/5 hover:text-cream"
            )}
          >
            <Icon size={16} strokeWidth={1.6} />
            {label}
            {active && !external && <span className="ml-auto h-1 w-1 rounded-full bg-gold" />}
          </Link>
        );
      })}
    </nav>
  );
}
