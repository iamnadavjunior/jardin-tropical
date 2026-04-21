import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apart Jardin Tropical — A garden retreat",
  description:
    "An intimate garden hotel of six rooms. Slow mornings, lush surroundings, refined comfort. Book your stay at Apart Jardin Tropical.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Apart Jardin Tropical",
    description: "An intimate garden hotel — six rooms, lush surroundings, refined comfort.",
    images: ["/images/highlights/tropical-21.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
