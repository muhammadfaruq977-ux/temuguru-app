import Link from "next/link";
import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const params = await searchParams;
  const code = params?.code || "TRX-XXXXXX";

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative flex flex-col items-center justify-center p-6">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-slate-100 relative z-10">
        
        {/* Dekorasi Atas */}
        <div className="h-32 bg-blue-600 w-full flex items-center justify-center relative">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg absolute top-20 border-4 border-white">
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pesanan Berhasil!</h1>
          <p className="text-xs text-slate-500 font-medium mb-6">
            Luar biasa! Jadwal belajar Anda sudah tercatat di sistem kami.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 border-dashed">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Kode Pesanan (TRX)</p>
            <p className="text-2xl font-mono font-black text-blue-600 tracking-widest">{code}</p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3 flex items-center justify-center gap-2 mb-8 border border-emerald-100 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-emerald-700">Terproteksi Sistem Escrow Platform</span>
          </div>

          <div className="space-y-3">
            <Link 
              href="/dashboard" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 cursor-pointer hover:-translate-y-0.5"
            >
              Lihat Dasbor Siswa <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/tutors" 
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center border border-slate-200 cursor-pointer"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20status%20pesanan%20les%20privat." 
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