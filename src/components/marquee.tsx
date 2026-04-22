export function Marquee() {
  const items = ["Stay with us", "Aparthotel Jardin Tropical", "Six rooms, one garden", "Reserve your retreat"];
  return (
    <div className="overflow-hidden border-y border-cream/10 py-8 bg-ink">
      <div className="marquee">
        {[...Array(2)].map((_, k) => (
          <div key={k} className="flex shrink-0 items-center gap-12 pr-12">
            {items.concat(items).map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-12 font-serif text-4xl md:text-5xl text-cream/90">
                {t}
                <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
