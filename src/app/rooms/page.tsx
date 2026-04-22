import { Reveal } from "@/components/reveal";
import { RoomsExplorer } from "@/components/rooms-explorer";
import { getAllRooms } from "@/lib/rooms";
import { T } from "@/lib/i18n";

export const metadata = {
  title: "Rooms & Suites — Aparthotel Jardin Tropical",
  description: "Six unique rooms set within a tropical garden. Reserve your stay.",
};

export default async function RoomsPage() {
  const rooms = await getAllRooms();

  return (
    <>
      {/* Explore — same component as homepage */}
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-24 bg-cream-200">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h2 className="display-2 text-ink leading-[1.05] whitespace-nowrap">
                <T en="Explore Our Rooms" fr="Découvrez Nos Chambres" />
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 space-y-6">
            <RoomsExplorer rooms={rooms} />
          </div>
        </div>
      </section>
    </>
  );
}
