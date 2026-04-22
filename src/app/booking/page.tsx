import { Suspense } from "react";
import { Reveal } from "@/components/reveal";
import { BookingFlow } from "@/components/booking-flow";
import { getAllRooms } from "@/lib/rooms";

export const metadata = {
  title: "Book your stay — Aparthotel Jardin Tropical",
  description: "Reserve your stay at Aparthotel Jardin Tropical in three simple steps.",
};

export default async function BookingPage() {
  const rooms = await getAllRooms();

  return (
    <>
      <section className="pt-40 pb-12 sm:pt-48 sm:pb-16 bg-cream-200">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Reserve</p>
            <h1 className="display-1 mt-6 text-ink max-w-4xl">Book your stay.</h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">
              Three steps. Instant confirmation. No hidden fees.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <Suspense fallback={<div className="h-96" />}>
            <BookingFlow rooms={rooms} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
