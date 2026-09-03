import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

// Server Action untuk memproses login
async function handleLogin(formData: FormData) {
  "use server";

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) return;

  // 1. Cek apakah user ada di database Prisma
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    redirect("/login?error=user_not_found");
  }

  // 2. Autentikasi via Supabase Auth
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 3. Tangani jika ada error dari Supabase Auth
  if (authError) {
    // Jika error karena email belum dikonfirmasi, TOLAK KETAT
    if (authError.message.toLowerCase().includes("email not confirmed")) {
      redirect("/login?error=email_not_verified");
    }

    // Fallback hanya untuk akun GUEST atau data lama yang belum terdaftar di Supabase Auth
    const isGuestOnly = user.password_hash?.startsWith("GUEST_ACCOUNT");
    const isLegacyMatch = user.password_hash === password;

    if (!isGuestOnly && !isLegacyMatch) {
      redirect("/login?error=invalid_password");
    }
  } else {
    // Validasi tambahan jika Supabase meloloskan sesi tapi email belum diverifikasi
    if (authData.user && !authData.user.email_confirmed_at && user.role !== "ADMIN") {
      await supabase.auth.signOut();
      redirect("/login?error=email_not_verified");
    }
  }

  // 4. Set cookie sesi login
  const cookieStore = await cookies();
  cookieStore.set("user_email", user.email, { 
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7 // 1 minggu
  });

  // 5. Redirect berdasarkan role dari database
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const resolvedSearch = await searchParams;
  const error = resolvedSearch.error;
  const message = resolvedSearch.message;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative flex items-center justify-center p-6">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-900/5 space-y-6 relative z-10">
        
        {/* LOGO & HEADER */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block mb-1">
            <img src="/logo.png" alt="Logo Temuguru" className="h-12 mx-auto object-contain" />
          </Link>
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-1 mt-2 border border-blue-100 shadow-2xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Masuk ke Temuguru</h1>
          <p className="text-xs text-slate-500 font-medium">Masukkan email dan password akun Anda untuk melanjutkan.</p>
        </div>

        {/* NOTIFIKASI SUKSES (VERIFIKASI EMAIL) */}
        {message === "check_email_verification" && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-2xl text-xs text-center font-medium leading-relaxed shadow-2xs">
            Pendaftaran berhasil! Silakan periksa inbox email Anda untuk melakukan verifikasi tautan sebelum masuk.
          </div>
        )}

        {/* NOTIFIKASI ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl text-xs text-center font-medium shadow-2xs">
            {error === "user_not_found" && "Email tidak terdaftar di sistem."}
            {error === "invalid_password" && "Password yang Anda masukkan salah."}
            {error === "email_not_verified" && "Email Anda belum diverifikasi. Silakan cek link verifikasi di inbox email Anda."}
          </div>
        )}

        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input 
                type="email" 
                name="email" 
                placeholder="nama@email.com" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer hover:-translate-y-0.5"
          >
            Masuk Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 space-y-2.5">
          <p className="text-xs text-slate-500 font-medium">
            Belum punya akun siswa? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
          </p>
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs">
              ← Kembali ke Beranda Utama
            </Link>
          </div>
        </div>

      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20layanan%20les%20privat." 
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