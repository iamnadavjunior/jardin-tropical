"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      setStatus("ok");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("err");
    }
  }

  return (
    <>
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-24 bg-cream-200">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Say hello</p>
            <h1 className="display-1 mt-6 text-ink max-w-4xl">Get in touch.</h1>
            <p className="mt-8 max-w-xl text-lg text-ink-muted leading-relaxed">
              We answer every message personally — usually within a few hours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          {/* Info */}
          <Reveal className="lg:col-span-5">
            <div className="space-y-10">
              {[
                { Icon: Mail, label: "Email", value: "info@jtropical.com", href: "mailto:info@jtropical.com" },
                { Icon: Phone, label: "Phone", value: "+257 76 718 975", href: "tel:+25776718975" },
                { Icon: MessageCircle, label: "WhatsApp", value: "Chat with us instantly", href: "https://wa.me/25776718975" },
                { Icon: MapPin, label: "Visit", value: "12 avenue Buyongwe, Mutanga Sud, Bujumbura, BURUNDI", href: "#location" },
              ].map(({ Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-start gap-5 group">
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-cream-200 text-gold-600 group-hover:bg-gold group-hover:text-white transition-colors">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">{label}</p>
                    <p className="font-serif text-xl text-ink mt-1 group-hover:text-gold-600 transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={150} className="lg:col-span-7">
            <form onSubmit={onSubmit} className="card-soft p-8 sm:p-10 space-y-6">
              <div>
                <label className="label">Your name</label>
                <input
                  required
                  className="field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  required type="email"
                  className="field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  required rows={6}
                  className="field resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your stay…"
                />
              </div>
              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-xs text-ink-muted">
                  {status === "ok" && <span className="text-jungle">✓ Sent — we'll be in touch soon.</span>}
                  {status === "err" && <span className="text-red-500">Something went wrong. Please try again.</span>}
                  {status === "sending" && "Sending…"}
                  {status === "idle" && "We typically reply within a few hours."}
                </p>
                <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-50">
                  Send message
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Map placeholder */}
      <section id="location" className="pb-28">
        <div className="container-x">
          <Reveal>
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-cream-200 grid place-items-center">
              <iframe
                title="Map"
                className="absolute inset-0 w-full h-full"
                src="https://maps.google.com/maps?q=12+avenue+Buyongwe,+Mutanga+Sud,+Bujumbura,+Burundi&output=embed"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
