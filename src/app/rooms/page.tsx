import { Reveal } from "@/components/reveal";
import { RoomCard } from "@/components/room-card";
import { getAllRooms } from "@/lib/rooms";

export const metadata = {
  title: "Rooms & Suites — Apart Jardin Tropical",
  description: "Six unique rooms set within a tropical garden. Reserve your stay.",
};

export default async function RoomsPage() {
  const rooms = await getAllRooms();

  return (
    <>
      {/* Page header */}
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-24 bg-cream-200">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Stay with us</p>
            <h1 className="display-1 mt-6 text-ink max-w-4xl">Rooms & Suites.</h1>
            <p className="mt-8 max-w-xl text-lg text-ink-muted leading-relaxed">
              Six rooms, each named after a capital city — each one private,
              each one different. Choose the one that suits the rhythm of your stay.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Rooms list */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          {rooms.map((r) => (
            <Reveal key={r.slug}>
              <RoomCard room={r} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
