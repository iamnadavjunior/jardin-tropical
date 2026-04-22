import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Aparthotel Jardin Tropical",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Each /admin/* page (except login) wraps itself in <AdminShell>.
  return <>{children}</>;
}
