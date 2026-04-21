import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rooms = [
  {
    slug: "bangui",
    name: "BANGUI",
    price: 40,
    capacity: 2,
    beds: 1,
    size: 32,
    shortDesc: "A serene tropical retreat with garden views and modern comforts.",
    description:
      "Step into BANGUI — our signature room blending warm woods, soft linens and a private window onto the lush garden. Designed for restful nights and slow mornings, it features a king bed, smart climate control, fresh local toiletries and a quiet writing corner. The mango trees outside cast a gentle dappled light through the day.",
    images: ["/images/highlights/tropical-2.jpg", "/images/highlights/tropical-7.jpg", "/images/highlights/tropical-21.jpg"],
    amenities: ["King bed", "Air conditioning", "Free Wi-Fi", "Garden view", "Private bathroom", "Smart TV"],
    featured: true,
  },
  {
    slug: "abidjan",
    name: "ABIDJAN",
    price: 60,
    capacity: 3,
    beds: 1,
    size: 42,
    shortDesc: "Our premier suite — a spacious sanctuary with private balcony.",
    description:
      "ABIDJAN is our largest stay — an elegant suite that opens onto a private balcony overlooking the gardens. A separate seating area, marble bathroom with rain shower, and curated artworks make it a favourite of long-stay guests. Perfect for couples or a relaxed solo escape with room to breathe.",
    images: ["/images/highlights/tropical-13.jpg", "/images/highlights/tropical-25.jpg", "/images/highlights/tropical-36.jpg"],
    amenities: ["King bed", "Private balcony", "Rain shower", "Mini-bar", "Workspace", "Free Wi-Fi", "Air conditioning"],
    featured: true,
  },
  {
    slug: "brasilia",
    name: "BRASILIA",
    price: 35,
    capacity: 2,
    beds: 1,
    size: 26,
    shortDesc: "Bright, minimal and timeless — a calm haven for two.",
    description:
      "Light pours into BRASILIA through wide louvered shutters, washing the room in a soft, golden warmth. A queen bed dressed in crisp cotton, a compact ensuite and thoughtful storage make it ideal for short getaways. Quiet, simple, beautifully kept.",
    images: ["/images/highlights/tropical-14.jpg", "/images/highlights/tropical-31.jpg", "/images/highlights/tropical-39.jpg"],
    amenities: ["Queen bed", "Air conditioning", "Free Wi-Fi", "Private bathroom", "Workspace"],
    featured: false,
  },
  {
    slug: "bujumbura",
    name: "BUJUMBURA",
    price: 35,
    capacity: 2,
    beds: 1,
    size: 26,
    shortDesc: "Twin comforts and morning light — quiet by design.",
    description:
      "BUJUMBURA faces the inner courtyard, where bird song begins each day. With twin beds, a writing desk and an ensuite finished in warm terracotta tiles, it's our most popular choice for friends travelling together or business stays.",
    images: ["/images/highlights/tropical-16.jpg", "/images/highlights/tropical-40.jpg", "/images/highlights/tropical-45.jpg"],
    amenities: ["Twin beds", "Air conditioning", "Free Wi-Fi", "Private bathroom", "Workspace"],
    featured: false,
  },
  {
    slug: "port-au-prince",
    name: "PORT AU PRINCE",
    price: 35,
    capacity: 2,
    beds: 1,
    size: 28,
    shortDesc: "Earthy textures, generous light, garden-side calm.",
    description:
      "PORT AU PRINCE is a tribute to craft — handwoven textiles, dark stained wood and matte ceramics. The room steps directly into a small private patio under the mangoes. A queen bed, soft reading chair and oversized shower complete the retreat.",
    images: ["/images/highlights/tropical-17.jpg", "/images/highlights/tropical-46.jpg", "/images/highlights/tropical-51.jpg"],
    amenities: ["Queen bed", "Private patio", "Air conditioning", "Free Wi-Fi", "Walk-in shower"],
    featured: false,
  },
  {
    slug: "libreville",
    name: "LIBREVILLE",
    price: 35,
    capacity: 2,
    beds: 1,
    size: 26,
    shortDesc: "Pared back and serene — for travellers who value simplicity.",
    description:
      "LIBREVILLE is the quietest of our rooms — set at the back of the property, framed by greenery on every side. A queen bed, soft white linens and a compact ensuite. Nothing more, nothing less. Ideal for those who travel light and sleep deeply.",
    images: ["/images/highlights/tropical-18.jpg", "/images/highlights/tropical-52.jpg", "/images/highlights/tropical-55.jpg"],
    amenities: ["Queen bed", "Air conditioning", "Free Wi-Fi", "Private bathroom"],
    featured: false,
  },
];

async function main() {
  console.log("→ Seeding rooms...");
  for (const r of rooms) {
    await prisma.room.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        price: r.price,
        capacity: r.capacity,
        beds: r.beds,
        size: r.size,
        shortDesc: r.shortDesc,
        description: r.description,
        images: JSON.stringify(r.images),
        amenities: JSON.stringify(r.amenities),
        featured: r.featured,
      },
      create: {
        slug: r.slug,
        name: r.name,
        price: r.price,
        capacity: r.capacity,
        beds: r.beds,
        size: r.size,
        shortDesc: r.shortDesc,
        description: r.description,
        images: JSON.stringify(r.images),
        amenities: JSON.stringify(r.amenities),
        featured: r.featured,
      },
    });
    console.log(`  ✓ ${r.name}`);
  }

  // Admin user (very simple — replace with hashed password in production)
  const email = process.env.ADMIN_EMAIL ?? "admin@jardintropical.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password, name: "Admin", role: "admin" },
  });
  console.log(`→ Admin user ready: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
