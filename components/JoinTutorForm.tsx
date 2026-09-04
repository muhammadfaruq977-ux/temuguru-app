"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, CheckCircle2, LogIn, AlertCircle } from "lucide-react";
import TutorTermsModal from "@/components/TutorTermsModal";
import { registerTutor } from "@/app/(public)/join/actions";

interface JoinTutorFormProps {
  isSuccess: boolean;
  errorParam?: string;
}

export default function JoinTutorForm({ isSuccess, errorParam }: JoinTutorFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formElement, setFormElement] = useState<HTMLFormElement | null>(null);

  const handleSubmitClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormElement(e.currentTarget);
    setIsModalOpen(true); // Membuka popup S&K saat tombol kirim diklik
  };

  const handleAgreeAndSubmit = () => {
    if (formElement) {
      // Menangkap seluruh data form
      const formData = new FormData(formElement);
      // Mengirimkan data langsung ke Server Action Next.js
      registerTutor(formData);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative flex items-center justify-center py-16 px-6">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-xl w-full space-y-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Pendaftaran Mitra Pengajar
            </span>

            <div>
              <Link href="/" className="inline-block my-2">
                <img src="/logo.png" alt="Logo Temuguru" className="h-12 mx-auto object-contain" />
              </Link>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Gabung Bersama Temuguru</h1>
              <p className="text-xs text-slate-500 font-medium">Daftarkan diri Anda sebagai pengajar privat dan kembangkan murid bersama kami.</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="bg-emerald-50/80 border border-emerald-200 p-8 rounded-[2rem] text-center space-y-5 shadow-2xs">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="font-black text-xl text-emerald-950">Pendaftaran Berhasil!</h2>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed max-w-sm mx-auto">
                  Akun dan data Anda telah tersimpan. Silakan cek email Anda untuk konfirmasi, lalu masuk ke Dashboard Guru menggunakan email dan password yang baru saja Anda buat.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link 
                  href="/tutors/login" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Masuk ke Dashboard Guru
                </Link>
                <Link 
                  href="/join" 
                  className="w-full sm:w-auto bg-white hover:bg-emerald-100/50 text-emerald-800 border border-emerald-200 text-xs font-bold px-6 py-4 rounded-2xl transition-all text-center shadow-2xs cursor-pointer"
                >
                  Daftar Lagi
                </Link>
              </div>
            </div>
          ) : (
            <form action={registerTutor} onSubmit={handleSubmitClick} className="space-y-4">
              {errorParam && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>
                    {errorParam === "already_exists" 
                      ? "Email atau Nomor WhatsApp ini sudah terdaftar! Gunakan data lain atau langsung masuk." 
                      : errorParam === "incomplete_fields"
                      ? "Semua kolom wajib diisi termasuk password."
                      : decodeURIComponent(errorParam)}
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Nama Lengkap & Gelar</label>
                <input type="text" name="name" required placeholder="Contoh: Siti Rahma, S.Pd" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Alamat Email Aktif</label>
                  <input type="email" name="email" required placeholder="Contoh: sitirahma@gmail.com" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Password (Minimal 6 Karakter)</label>
                  <input type="password" name="password" required minLength={6} placeholder="••••••••" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Nomor Rekening</label>
                <input type="text" name="bank_account" required placeholder="Contoh : BCA 123456789 a.n Budi" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Foto Profil Resmi</label>
                <input 
                  type="file" 
                  name="profilePhoto" 
                  accept="image/*" 
                  required 
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-slate-50 border border-slate-200 rounded-2xl" 
                />
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Unggah foto terbaik Anda (Format JPG/PNG).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Nomor WhatsApp Aktif</label>
                  <input type="text" name="phone_wa" required placeholder="Contoh: 081234567890" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Tarif / Jam (Rp)</label>
                  <input type="number" name="price_per_hour" required placeholder="Contoh: 75000 (Tanpa titik)" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Pendidikan Terakhir / Jurusan</label>
                  <input type="text" name="education" required placeholder="Contoh: S1 Biologi UNJ" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Pengalaman (Tahun)</label>
                  <input type="number" name="experience_years" required placeholder="Contoh: 2" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Domisili / Area Mengajar</label>
                <input type="text" name="location" required placeholder="Contoh: Mataram" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Bio / Pengalaman Singkat</label>
                <textarea name="bio" rows={3} placeholder="Ceritakan sedikit pengalaman mengajar Anda..." className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none font-medium text-slate-800" />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all text-sm cursor-pointer hover:-translate-y-0.5 mt-2">
                Kirim Pendaftaran Mitra
              </button>
            </form>
          )}
        </div>
      </div>

      <TutorTermsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAgree={handleAgreeAndSubmit}
      />

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20mitra%20pengajar." 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Hubungi Admin via WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
      >
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Butuh Bantuan? Chat Admin
        </span>
      </a>

    </div>
  );
}