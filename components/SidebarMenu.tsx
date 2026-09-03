"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

interface SidebarMenuProps {
  children: React.ReactNode;
}

export default function SidebarMenu({ children }: SidebarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Pastikan Portal hanya berjalan di sisi Klien (Browser) untuk menghindari error Next.js SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Kunci scroll layar utama saat tirai terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Isi dari Tirai yang akan dilempar keluar dari Navbar (menggunakan Portal)
  const drawerContent = (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Latar Belakang Gelap (Backdrop) */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Area Tirai Putih (Full Height) */}
      <div className="relative w-80 sm:w-96 h-full bg-slate-50 shadow-2xl flex flex-col z-10 animate-fade-in-right">
        
        {/* Header Tirai */}
        <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
            <h3 className="font-black text-slate-900 text-base">Menu Navigasi</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Menu */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Tombol Hamburger di Navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-2.5 md:p-3 rounded-2xl transition-all border border-slate-200 flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105"
        aria-label="Buka Menu"
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {/* Render Tirai langsung ke Body HTML agar tidak terpotong Navbar */}
      {mounted && isOpen && createPortal(drawerContent, document.body)}
    </>
  );
}