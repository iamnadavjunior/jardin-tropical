import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Mail, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, safeJsonArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: { ref: string } }) {
  let booking: Awaited<ReturnType<typeof prisma.booking.findUnique>> & { room?: { name: string; images: string } } | null = null;
  try {
    booking = await prisma.booking.findUnique({
      where: { reference: params.ref },
      include: { room: true },
    });
  } catch {
    booking = null;
  }
  if (!booking) return notFound();

  const heroImg = safeJsonArray(booking.room?.images)[0] ?? "/images/highlights/tropical-21.jpg";

  return (
    <>
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-20 bg-cream-200">
        <div className="container-x text-center">
          <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-jungle text-cream animate-fade-up">
            <Check size={28} strokeWidth={2} />
          </div>
          <p className="eyebrow mt-8 justify-center">Confirmed</p>
          <h1 className="display-1 mt-6 text-ink">Your stay is booked.</h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-ink-muted">
            A confirmation has been sent to <strong className="text-ink">{booking.email}</strong>. We can't wait to host you.
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            Reference <span className="font-mono text-ink">{booking.reference}</span>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="card-soft overflow-hidden">
            <div className="relative aspect-[5/3]">
              <Image src={heroImg} alt={booking.room?.name ?? ""} fill sizes="600px" className="object-cover" />
            </div>
            <div className="p-8 space-y-2">
              <p className="eyebrow">Room</p>
              <h2 className="font-serif text-3xl text-ink">{booking.room?.name}</h2>
              <p className="text-sm text-ink-muted">at Aparthotel Jardin Tropical</p>
            </div>
          </div>

          <div className="card-soft p-8 space-y-6">
            <h3 className="font-serif text-2xl text-ink">Details</h3>
            <div className="divide-y divide-ink/5">
              {[
                { l: "Guest", v: booking.customerName },
                { l: "Email", v: booking.email },
                { l: "Phone", v: booking.phone },
                { l: "Check-in", v: formatDate(booking.checkIn) },
                { l: "Check-out", v: formatDate(booking.checkOut) },
                { l: "Nights", v: String(booking.nights) },
                { l: "Guests", v: String(booking.guests) },
                { l: "Total", v: formatCurrency(booking.totalPrice) },
              ].map((r) => (
                <div key={r.l} className="flex justify-between gap-6 py-3 text-sm">
                  <span className="text-ink-muted uppercase tracking-[0.18em] text-xs">{r.l}</span>
                  <span className="text-ink text-right">{r.v}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-ink/5 grid gap-3 sm:grid-cols-2 text-sm">
              <a href="mailto:hello@jardintropical.com" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink">
                <Mail size={14} /> Contact us
              </a>
              <a href="#" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink">
                <MapPin size={14} /> Get directions
              </a>
            </div>

            <Link href="/" className="btn-primary w-full justify-center">
              Back to home <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
