import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Ornamen Latar Belakang (Menyesuaikan dengan Tema Utama) */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-400/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Konten Loading */}
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
        
        {/* Logo atau Ikon Berputar / Berdenyut */}
        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/20 animate-pulse">
          <GraduationCap className="w-10 h-10 animate-bounce" />
        </div>

        {/* Teks Merek & Status */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Temuguru
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            Memuat Halaman...
          </p>
        </div>

      </div>
    </div>
  );
}