"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [email, setEmail] = useState("admin@jardintropical.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Login failed");
      router.push(from);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Left: brand */}
      <div className="hidden lg:flex relative bg-ink overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/highlights/tropical-21.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/80 to-jungle/60" />
        <div className="relative p-12 flex flex-col justify-between text-cream w-full">
          <Link href="/" className="font-serif text-xl">Aparthotel Jardin Tropical</Link>
          <div>
            <p className="eyebrow text-gold mb-6">Admin Suite</p>
            <h1 className="display-2">Manage your<br />garden retreat.</h1>
            <p className="mt-6 text-cream/70 max-w-md">
              Bookings, rooms, guests — everything in one calm dashboard.
            </p>
          </div>
          <div className="text-xs text-cream/40 space-y-1">
            <p>© {new Date().getFullYear()} Aparthotel Jardin Tropical</p>
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
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden font-serif text-xl text-ink mb-12 block text-center">
            Aparthotel Jardin Tropical
          </Link>
          <p className="eyebrow">Sign in</p>
          <h2 className="display-3 mt-3">Welcome back.</h2>
          <p className="mt-3 text-sm text-ink-muted">
            Use your admin credentials to continue.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-xs text-ink-muted text-center pt-4">
              Default: admin@jardintropical.com / admin123
            </p>
          </form>

          <p className="mt-12 text-center text-[11px] text-ink-muted/70 lg:hidden">
            Designed by{" "}
            <a
              href="https://flexostudio.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-ink transition-colors tracking-[0.18em] uppercase"
            >
              Flexo Studio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
