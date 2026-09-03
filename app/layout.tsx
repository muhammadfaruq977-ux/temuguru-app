import type { Metadata } from "next";
import "./globals.css"; // Ini wajib agar Tailwind CSS Anda berfungsi

export const metadata: Metadata = {
  title: "Temuguru - Platform Les Privat",
  description: "Temukan guru privat terbaik untuk masa depanmu.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Temuguru",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased text-slate-800 bg-slate-50">
        {/* HANYA MENAMPILKAN KONTEN HALAMAN */}
        {children}
      </body>
    </html>
  );
}