"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight, Users, Bed, Maximize2, ArrowLeft } from "lucide-react";
import type { RoomDTO } from "@/lib/rooms";
import { cn, formatCurrency, diffNights, formatDate } from "@/lib/utils";

type Step = 1 | 2 | 3;

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function BookingFlow({ rooms }: { rooms: RoomDTO[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const initialSlug = params.get("room") ?? rooms[0]?.slug;

  const [step, setStep] = useState<Step>(1);
  const [roomSlug, setRoomSlug] = useState<string>(initialSlug);
  const [checkIn, setCheckIn] = useState(todayISO(7));
  const [checkOut, setCheckOut] = useState(todayISO(9));
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const room = useMemo(() => rooms.find((r) => r.slug === roomSlug) ?? rooms[0], [rooms, roomSlug]);
  const nights = diffNights(checkIn, checkOut);
  const total = room ? room.price * nights : 0;

  const datesValid = new Date(checkOut) > new Date(checkIn);
  const guestsValid = room && guests > 0 && guests <= room.capacity;
  const detailsValid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && phone.trim().length >= 6;

  const next = () => {
    setError(null);
    if (step === 1 && (!roomSlug || !datesValid || !guestsValid)) {
      setError(!datesValid ? "Check-out must be after check-in." : "Please check guest count for this room.");
      return;
    }
    if (step === 2 && !detailsValid) {
      setError("Please complete your name, email and phone.");
      return;
    }
    setStep((s) => (s === 3 ? s : ((s + 1) as Step)));
  };
  const back = () => setStep((s) => (s === 1 ? s : ((s - 1) as Step)));

  async function submit() {
    if (!room) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          roomSlug: room.slug,
          customerName: name,
          email,
          phone,
          guests,
          checkIn,
          checkOut,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed.");
      router.push(`/booking/confirmation/${data.reference}`);
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  }

  if (!room) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
      {/* Main flow */}
      <div>
        {/* Stepper */}
        <ol className="flex items-center gap-3 sm:gap-6 mb-12">
          {[
            { n: 1, label: "Stay" },
            { n: 2, label: "Guest" },
            { n: 3, label: "Review" },
          ].map((s, i, arr) => {
            const done = step > s.n;
            const active = step === s.n;
            return (
              <li key={s.n} className="flex items-center gap-3 sm:gap-6">
                <div
                  className={cn(
                    "grid place-items-center w-8 h-8 rounded-full text-xs transition-all",
                    done && "bg-jungle text-cream",
                    active && "bg-ink text-cream",
                    !done && !active && "bg-cream-200 text-ink-muted"
                  )}
                >
                  {done ? <Check size={14} /> : s.n}
                </div>
                <span className={cn("text-sm tracking-wide", active ? "text-ink" : "text-ink-muted")}>{s.label}</span>
                {i < arr.length - 1 && <span className="hidden sm:block w-8 h-px bg-ink/15" />}
              </li>
            );
          })}
        </ol>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-10 animate-fade-up">
            <div>
              <h2 className="display-3 text-ink">Choose your room</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {rooms.map((r) => {
                  const selected = r.slug === room.slug;
                  return (
                    <button
                      key={r.slug}
                      onClick={() => setRoomSlug(r.slug)}
                      className={cn(
                        "group text-left rounded-2xl overflow-hidden border transition-all duration-300",
                        selected ? "border-gold ring-2 ring-gold/30" : "border-ink/10 hover:border-ink/30"
                      )}
                    >
                      <div className="relative aspect-[5/3]">
                        <Image src={r.images[0]} alt={r.name} fill className="object-cover" sizes="50vw" />
                        {selected && (
                          <span className="absolute top-3 right-3 grid place-items-center w-7 h-7 rounded-full bg-gold text-white">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <div className="p-5 bg-white">
                        <p className="font-serif text-lg text-ink">{r.name}</p>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-ink-muted">Up to {r.capacity} · {r.size} m²</span>
                          <span className="font-medium text-ink">{formatCurrency(r.price)} / nt</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="display-3 text-ink">Your dates</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Check-in</label>
                  <input type="date" min={todayISO()} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="field" />
                </div>
                <div>
                  <label className="label">Check-out</label>
                  <input type="date" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="field" />
                </div>
                <div>
                  <label className="label">Guests</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field">
                    {Array.from({ length: room.capacity }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-up">
            <h2 className="display-3 text-ink">Your details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="field" placeholder="+1 (234) 567-890" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Special requests <span className="text-ink-muted/70 normal-case tracking-normal">(optional)</span></label>
                <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="field resize-none" placeholder="Anything we should know?" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-up">
            <h2 className="display-3 text-ink">Review your stay</h2>
            <div className="card-soft divide-y divide-ink/5">
              <Row label="Room" value={room.name} />
              <Row label="Guest" value={`${name} · ${email}`} />
              <Row label="Phone" value={phone} />
              <Row label="Check-in" value={formatDate(checkIn)} />
              <Row label="Check-out" value={formatDate(checkOut)} />
              <Row label="Guests" value={`${guests}`} />
              <Row label="Nights" value={`${nights}`} />
              {notes && <Row label="Notes" value={notes} />}
            </div>
            <p className="text-xs text-ink-muted">
              By confirming, you agree to our terms. You will receive a confirmation email shortly.
            </p>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 1}
            className="btn-ghost disabled:opacity-30"
          >
            <ArrowLeft size={16} /> Back
          </button>
          {step < 3 ? (
            <button onClick={next} className="btn-primary">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn-gold disabled:opacity-60">
              {submitting ? "Confirming…" : "Confirm booking"}
            </button>
          )}
        </div>
      </div>

      {/* Sidebar summary */}
      <aside className="lg:sticky lg:top-28 self-start">
        <div className="card-soft overflow-hidden">
          <div className="relative aspect-[5/3]">
            <Image src={room.images[0]} alt={room.name} fill className="object-cover" sizes="400px" />
          </div>
          <div className="p-6 space-y-5">
            <div>
              <p className="eyebrow">Your stay</p>
              <h3 className="font-serif text-2xl text-ink mt-2">{room.name}</h3>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><Users size={12} /> {guests}</span>
              <span className="inline-flex items-center gap-1.5"><Bed size={12} /> {room.beds} bed</span>
              <span className="inline-flex items-center gap-1.5"><Maximize2 size={12} /> {room.size} m²</span>
            </div>

            <div className="space-y-2 pt-4 border-t border-ink/5 text-sm">
              <Line a={formatDate(checkIn)} b="Check-in" />
              <Line a={formatDate(checkOut)} b="Check-out" />
              <Line a={`${nights} ${nights === 1 ? "night" : "nights"}`} b="Duration" />
            </div>

            <div className="space-y-2 pt-4 border-t border-ink/5 text-sm">
              <Line a={`${formatCurrency(room.price)} × ${nights}`} b={formatCurrency(room.price * nights)} />
              <Line a="Taxes & fees" b="Included" />
            </div>

            <div className="pt-4 border-t border-ink/5 flex items-baseline justify-between">
              <span className="text-sm text-ink-muted uppercase tracking-[0.18em]">Total</span>
              <span className="font-serif text-3xl text-ink">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 px-6 py-4">
      <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      <span className="text-sm text-ink text-right">{value}</span>
    </div>
  );
}

function Line({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-muted">{a}</span>
      <span className="text-ink">{b}</span>
    </div>
  );
}
