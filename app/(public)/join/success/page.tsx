import Link from "next/link";
import { CheckCircle2, ArrowRight, MessageCircle, Clock } from "lucide-react";

export default function JoinSuccessPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative flex items-center justify-center p-6">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-900/5 text-center space-y-6 relative z-10">
        
        {/* ICON SUKSES */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* HEADLINE */}
        <div className="space-y-2">
          <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-blue-200">
            Pendaftaran Diterima
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Selamat Bergabung!</h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Data pendaftaran Anda telah berhasil dikirim dan masuk ke sistem admin Temuguru.
          </p>
        </div>

        {/* INFO PROSES VERIFIKASI */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Langkah Selanjutnya:</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-2 list-disc list-inside font-medium leading-relaxed">
            <li>Silakan masuk ke Dashboard Guru untuk melengkapi profil Anda.</li>
            <li>Unggah foto <strong>KTP & Ijazah</strong> di menu profil agar akun Anda segera diverifikasi oleh Admin.</li>
          </ul>
        </div>

        {/* TOMBOL AKSI */}
        <div className="space-y-3 pt-2">
          <Link
            href="/tutors/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
          >
            Masuk ke Dashboard Guru <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20baru%20saja%20mendaftar%20sebagai%20guru."
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-4 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <MessageCircle className="w-4 h-4" /> Konfirmasi ke Admin via WA
          </a>
        </div>

      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20mitra%20pengajar." 
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