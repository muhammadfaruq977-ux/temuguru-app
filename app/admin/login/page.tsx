"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* KOLOM KIRI: Form Login */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl text-blue-600 tracking-tight">Temuguru</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-sm text-slate-500 mt-1">Masuk untuk mengelola platform pengajar.</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> Username atau Password salah!
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Username</label>
              <div className="flex items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-500 transition-all">
                <User className="w-4 h-4 text-slate-400 mr-2" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-transparent w-full text-sm outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="flex items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-500 transition-all">
                <Lock className="w-4 h-4 text-slate-400 mr-2" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent w-full text-sm outline-none" />
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl mt-4 transition-all shadow-md shadow-blue-200">
              Masuk ke Dasbor
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: Area Ilustrasi */}
        <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Aksen Dekorasi Lingkaran Cahaya */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex items-center gap-2 text-blue-200 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-300" /> Pengelolaan Ekosistem Belajar
          </div>

          <div className="relative z-10 space-y-4 my-auto">
            {/* Tempat Gambar Ilustrasi */}
            <div className="w-full h-48 bg-blue-700/50 rounded-2xl border border-blue-500/30 flex items-center justify-center backdrop-blur-sm overflow-hidden shadow-inner">
              {/* Anda bisa mengganti teks ini dengan tag <img src="/path-gambar.png" alt="Ilustrasi" className="w-full h-full object-cover" /> */}
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-500/40 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-400/30">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>
                <p className="text-xs text-blue-100 font-medium">Area Ilustrasi Visual / Banner Admin</p>
              </div>
            </div>
            <h2 className="text-xl font-bold leading-snug">Kelola Guru & Pesanan dengan Cepat & Akurat.</h2>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Semua kendali transaksi, verifikasi mitra, dan kurikulum ada dalam satu genggaman sistem Temuguru.
            </p>
          </div>

          <div className="relative z-10 text-[10px] text-blue-200">
            &copy; 2026 Temuguru Inc. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}