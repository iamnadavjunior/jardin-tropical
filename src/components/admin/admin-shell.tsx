import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getSession } from "@/lib/auth";
import { AdminNav } from "./admin-nav";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream-200">
      <aside className="fixed inset-y-0 left-0 hidden lg:flex w-64 flex-col bg-ink text-cream/80 z-40">
        <div className="px-6 pt-8 pb-6 border-b border-cream/10">
          <Link href="/" className="font-serif text-lg text-cream tracking-tightish">
            Apart Jardin
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gold">Admin Suite</p>
        </div>

        <AdminNav />

        <div className="mt-auto p-5 border-t border-cream/10">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-9 h-9 rounded-full bg-gold/20 text-gold text-sm font-medium">
              {user.email[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-cream truncate">{user.name ?? "Admin"}</p>
              <p className="text-xs text-cream/50 truncate">{user.email}</p>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="p-1.5 text-cream/60 hover:text-cream transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-ink text-cream px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="font-serif text-base">Apart Jardin · Admin</Link>
        <form action="/api/auth/logout" method="post">
          <button className="text-cream/70"><LogOut size={16} /></button>
        </form>
      </header>

      <div className="lg:pl-64">
        <div className="p-6 sm:p-10 max-w-[1400px]">{children}</div>
      </div>
    </div>
  );
}
