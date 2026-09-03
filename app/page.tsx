import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Star, GraduationCap, LogIn, Zap, Target, CheckCircle2, Users, Lock, Award, Sparkle, QrCode, Quote, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // Mengambil data statistik, ulasan, dan daftar siswa terbaru secara real-time dari database
  let totalTutors = 0;
  let totalStudents = 0;
  let totalCompletedBookings = 0;
  let averageRating = "4.9";
  let totalReviews = 0;
  let recentReviews: any[] = [];
  let recentStudents: any[] = [];

  try {
    totalTutors = await prisma.tutor.count({
      where: { is_verified: true },
    });
  } catch (e) {
    totalTutors = 0;
  }

  try {
    totalStudents = await prisma.user.count();
  } catch (e) {
    totalStudents = 0;
  }

  try {
    totalCompletedBookings = await prisma.booking.count({
      where: { status: "COMPLETED" },
    });
  } catch (e) {
    totalCompletedBookings = 0;
  }

  try {
    const aggregateRating = await prisma.review.aggregate({
      _avg: { rating: true },
    });
    if (aggregateRating._avg.rating) {
      averageRating = aggregateRating._avg.rating.toFixed(1);
    }
    totalReviews = await prisma.review.count();

    recentReviews = await prisma.review.findMany({
      take: 3,
      include: {
        user: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  } catch (e) {
    averageRating = "4.9";
    totalReviews = 0;
    recentReviews = [];
  }

  try {
    recentStudents = await prisma.user.findMany({
      take: 4,
      orderBy: {
        id: 'desc',
      },
    });
  } catch (e) {
    recentStudents = [];
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[18%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[45%] left-10 w-[550px] h-[550px] bg-indigo-400/40 rounded-full blur-[110px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* FLOATING GEOMETRIC SHAPES */}
      <div className="absolute top-24 left-12 w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500/40 to-purple-500/40 border-2 border-white backdrop-blur-md shadow-xl -rotate-12 animate-[bounce_6s_infinite] pointer-events-none z-0 hidden md:block"></div>
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/35 to-cyan-500/35 border-2 border-white backdrop-blur-md shadow-xl animate-[bounce_8s_infinite] pointer-events-none z-0 hidden md:block"></div>
      <div className="absolute top-1/2 left-8 w-16 h-16 rounded-xl bg-blue-600/30 border-2 border-blue-200 backdrop-blur-md shadow-md rotate-45 animate-pulse pointer-events-none z-0 hidden lg:block"></div>
      <div className="absolute top-[65%] right-12 w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-500/35 to-pink-500/35 border-2 border-white backdrop-blur-md shadow-xl rotate-12 animate-[bounce_7s_infinite] pointer-events-none z-0 hidden md:block"></div>

      {/* NAVBAR PUBLIK (RESPONSIF) */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 md:px-12 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-xs">
        
        {/* KIRI: Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img 
            src="/logo.png" 
            alt="Logo Temuguru" 
            className="h-8 md:h-12 w-auto object-contain max-h-[48px]" 
          />
        </Link>

        {/* TENGAH: Menu Navigasi */}
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <Link href="#keunggulan" className="hover:text-blue-600 transition-colors">Keunggulan</Link>
          <Link href="/tutors" className="hover:text-blue-600 transition-colors">Cari Guru</Link>
          <Link href="#testimoni" className="hover:text-blue-600 transition-colors">Ulasan Siswa</Link>
        </div>

        {/* KANAN: Tombol Aksi & Login */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
          <Link 
            href="/tutors/login" 
            className="hidden xl:flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-blue-600 transition-all"
          >
            Masuk sebagai Guru
          </Link>
          
          <div className="h-5 w-px bg-slate-200 hidden xl:block mx-1"></div>

          <Link 
            href="/login" 
            className="text-blue-600 hover:bg-blue-50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all"
          >
            Masuk
          </Link>
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            Daftar <span className="hidden sm:inline">Sekarang</span>
          </Link>
        </div>
        
      </nav>

      {/* HERO SECTION DENGAN GAYA MODERN & TERANG (CLEAN UI) */}
      <div className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden z-10">
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* KOLOM KIRI: Teks & Call-to-Action */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Badge Kecil di Atas */}
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100/80 text-blue-700 text-xs font-extrabold rounded-full uppercase tracking-wider border border-blue-200 shadow-sm">
              <BookOpen className="w-4 h-4 text-blue-600" /> Platform Les Privat Terpercaya
            </div>
            
            {/* Headline Besar */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Pilih Guru. <br className="hidden sm:block" />
              Mulai Belajar. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Raih Prestasi.
              </span>
            </h1>
            
            {/* Deskripsi */}
            <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Dapatkan akses tanpa batas ke ribuan pengajar profesional dan temukan strategi belajar terbaik yang disesuaikan khusus untuk kebutuhan akademik Anda.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link 
                href="/tutors" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                Cari Guru Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/join" 
                className="w-full sm:w-auto bg-white/90 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-8 py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-5 h-5 text-blue-600" /> Gabung sebagai Guru
              </Link>
            </div>

            {/* Social Proof (Bintang & Avatar Real-Time dari Database) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-6 border-t border-slate-200/60 mt-8">
              <div className="flex -space-x-3">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student, idx) => {
                    const avatarUrl = student.image || `https://i.pravatar.cc/100?img=${idx + 10}`;
                    return (
                      <img 
                        key={student.id || idx} 
                        src={avatarUrl} 
                        alt={student.name || "Siswa Temuguru"} 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" 
                      />
                    );
                  })
                ) : (
                  <>
                    <img src="https://i.pravatar.cc/100?img=1" alt="Siswa 1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                    <img src="https://i.pravatar.cc/100?img=2" alt="Siswa 2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                    <img src="https://i.pravatar.cc/100?img=3" alt="Siswa 3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                    <img src="https://i.pravatar.cc/100?img=4" alt="Siswa 4" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                  </>
                )}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Bergabung bersama <span className="font-bold text-slate-800">{totalStudents}+ siswa</span> meraih nilai impian.
                </p>
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Gambar Lokal Hero yang Sudah Dioptimalkan (/tutor-hero.webp) */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-blue-300 rounded-full scale-[0.8] z-0 blur-3xl opacity-50"></div>
            
            <img 
              src="/tutor-hero.webp" 
              alt="Pelajar Temuguru" 
              className="relative z-10 w-full max-w-md mx-auto object-cover h-[500px] rounded-[3rem] shadow-2xl border-8 border-white"
            />

            {/* Kartu Melayang 1 (Atas Kanan) */}
            <div className="absolute top-12 -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 flex items-center gap-4 animate-[bounce_4s_infinite]">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{totalTutors}+</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Guru Terverifikasi</p>
              </div>
            </div>

            {/* Kartu Melayang 2 (Tengah Kiri) */}
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 flex items-center gap-4 animate-[bounce_5s_infinite]">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{totalStudents}+</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Siswa Terdaftar</p>
              </div>
            </div>

            {/* Kartu Melayang 3 (Bawah Kanan) */}
            <div className="absolute bottom-16 -right-2 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 flex items-center gap-4 animate-[bounce_6s_infinite]">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{averageRating}/5.0</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rating Kepuasan</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* TRUST BADGES / LOGO PARTNER & PEMBAYARAN (MARQUEE DENGAN LOGO & TEKS) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-10 relative z-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Dipercaya & Didukung Oleh Jaringan Terkemuka
          </p>
        </div>
        
        {/* Kontainer Marquee / Berjalan */}
        <div className="relative w-full overflow-hidden flex whitespace-nowrap">
          <div className="flex w-max animate-[marquee_25s_linear_infinite] items-center gap-16 md:gap-24 opacity-80 hover:opacity-100 transition-all duration-500">
            
            {/* Set Pertama Partner (Logo + Teks) */}
            <div className="flex items-center gap-16 md:gap-24 shrink-0">
              <div className="flex items-center gap-3">
                <img src="/logos/bca.png" alt="BCA" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">BCA</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/bri.png" alt="BRI" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">Bank BRI</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/qris.png" alt="QRIS" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">QRIS</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/gopay.png" alt="GoPay" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter italic">GoPay</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/kemdikbud.png" alt="Kemdikbud" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">Kemdikbud</span>
              </div>
            </div>

            {/* Set Kedua Partner (Duplikasi untuk Seamless Infinite Loop) */}
            <div className="flex items-center gap-16 md:gap-24 shrink-0">
              <div className="flex items-center gap-3">
                <img src="/logos/bca.png" alt="BCA" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">BCA</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/bri.png" alt="BRI" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">Bank BRI</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/qris.png" alt="QRIS" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">QRIS</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/gopay.png" alt="GoPay" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter italic">GoPay</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/logos/kemdikbud.png" alt="Kemdikbud" className="h-7 w-auto object-contain" />
                <span className="text-xl font-black text-slate-800 tracking-tighter">Kemdikbud</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CSS Animasi Marquee */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />

      {/* SEKSI INFORMASI: KEUNGGULAN PLATFORM */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-16 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest bg-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200 shadow-2xs">
            <Sparkle className="w-3.5 h-3.5 text-blue-600" /> Mengapa Temuguru?
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Keunggulan Utama yang Kami Tawarkan
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Kami berkomitmen memberikan ekosistem belajar yang aman, nyaman, dan berorientasi penuh pada prestasi akademik anak.
          </p>
        </div>

        {/* KOLASE FOTO ILUSTRASI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="rounded-[2rem] overflow-hidden shadow-lg h-56 relative group">
            <img 
              src="/foto1.webp"
              alt="Suasana Belajar 1" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
              <p className="text-white text-sm font-bold">Pendampingan Intensif Langsung ke Rumah</p>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-lg h-56 relative group md:-translate-y-4">
            <img 
              src="/foto2.webp" 
              alt="Suasana Belajar 2" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
              <p className="text-white text-sm font-bold">Suasana Belajar Interaktif & Menyenangkan</p>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-lg h-56 relative group">
            <img 
              src="/foto3.webp" 
              alt="Suasana Belajar 3" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
              <p className="text-white text-sm font-bold">Fokus Penuh Peningkatan Prestasi Siswa</p>
            </div>
          </div>
        </div>

        {/* 4 PILAR KEUNGGULAN */}
        <div id="keunggulan" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 transition-transform duration-300 group-hover:scale-125"></div>
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">Standar Tertinggi</span>
                <h3 className="text-lg font-black text-slate-900 mt-2">Verifikasi Ketat & Legal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Setiap pengajar melalui seleksi administrasi berlapis. KTP dan ijazah asli divalidasi langsung oleh tim admin demi keamanan mutlak Anda.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Terverifikasi Admin</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-indigo-900/5 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 transition-transform duration-300 group-hover:scale-125"></div>
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">Proteksi 100%</span>
                <h3 className="text-lg font-black text-slate-900 mt-2">Jaminan Dana Aman</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dana pembayaran Anda terlindungi sepenuhnya oleh sistem. Uang hanya akan diteruskan ke guru setelah sesi belajar tuntas dilaksanakan.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transaksi Transparan & Aman</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-emerald-900/5 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 transition-transform duration-300 group-hover:scale-125"></div>
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-emerald-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">Bebas Atur Waktu</span>
                <h3 className="text-lg font-black text-slate-900 mt-2">Mudah & Fleksibel</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilih guru, sesuaikan jadwal privat langsung ke rumah, dan nikmati kemudahan booking tanpa proses birokrasi yang rumit.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Booking Cepat & Praktis</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-amber-900/5 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 transition-transform duration-300 group-hover:scale-125"></div>
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-amber-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Target className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-100">Hasil Terbukti</span>
                <h3 className="text-lg font-black text-slate-900 mt-2">Kualitas Pembelajaran</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Metode interaktif berfokus pada pemahaman konsep mendalam, membantu anak menguasai pelajaran dengan cepat dan menyenangkan.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fokus Peningkatan Akademik</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* SEKSI ULASAN SISWA / TESTIMONI */}
      <section id="testimoni" className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-t border-slate-200/60 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest bg-amber-100 text-amber-700 px-4 py-2 rounded-full border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Ulasan Siswa
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Apa Kata Mereka yang Telah Bergabung?
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Kepuasan siswa dan orang tua adalah prioritas utama kami dalam menghadirkan layanan les privat berkualitas.
          </p>
        </div>

        {recentReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentReviews.map((rev, index) => {
              const colors = ["bg-blue-600", "bg-indigo-600", "bg-emerald-600"];
              const avatarBg = colors[index % colors.length];
              const studentName = rev.user?.name || "Siswa Temuguru";
              const initial = studentName.charAt(0).toUpperCase();
              const reviewText = rev.comment || rev.review || "Sangat memuaskan dan membantu proses belajar!";
              const ratingVal = rev.rating || 5;

              return (
                <div key={rev.id || index} className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < ratingVal ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                        />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-blue-200" />
                    <p className="text-slate-600 text-sm italic leading-relaxed">
                      &quot;{reviewText}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className={`w-10 h-10 ${avatarBg} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md`}>
                      {initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{studentName}</h4>
                      <p className="text-xs text-slate-400">Siswa / Orang Tua</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-6">
              <Quote className="w-10 h-10 text-blue-200" />
              <p className="text-slate-600 text-sm italic leading-relaxed">
                &quot;Sangat terbantu dengan sistem di Temuguru. Guru privat yang datang ke rumah sangat sabar dan anak saya jadi lebih semangat belajar matematika!&quot;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  I
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ibu Indah</h4>
                  <p className="text-xs text-slate-400">Orang Tua Siswa SD</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-6">
              <Quote className="w-10 h-10 text-blue-200" />
              <p className="text-slate-600 text-sm italic leading-relaxed">
                &quot;Pilihan gurunya banyak dan semuanya profesional. Proses booking dan pembayarannya juga sangat transparan dan aman.&quot;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Rian Pratama</h4>
                  <p className="text-xs text-slate-400">Siswa SMA Kelas 12</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-6">
              <Quote className="w-10 h-10 text-blue-200" />
              <p className="text-slate-600 text-sm italic leading-relaxed">
                &quot;Rating kepuasannya terbukti nyata. Fitur ulasan setelah sesi belajar selesai membuat kami sebagai orang tua bisa memantau kualitas pengajar.&quot;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  B
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bapak Budi</h4>
                  <p className="text-xs text-slate-400">Orang Tua Siswa SMP</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* BANNER BAWAH / CALL TO ACTION */}
      <section className="bg-slate-50 py-16 md:py-24 border-t border-slate-100 relative z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0 border border-amber-100 shadow-inner">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Belajar dari ahlinya.<br />Tingkatkan prestasimu.
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Bergabung bersama ribuan siswa dan pengajar di platform les privat terbaik.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center shrink-0 w-full sm:w-auto mt-4 md:mt-0">
              <Link 
                href="/register" 
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                Daftar Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Transaksi Aman Terlindungi
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER / COPYRIGHT SECTION */}
      <footer className="bg-white border-t border-slate-200/60 py-8 text-center text-xs text-slate-500 font-medium relative z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Temuguru. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON DENGAN LOGO RESMI WHATSAPP */}
      <a 
        href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20layanan%20les%20privat." 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Hubungi Admin via WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
      >
        {/* Ikon SVG Logo Resmi WhatsApp */}
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        {/* Tooltip Teks */}
        <span className="absolute right-full mr-3 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Butuh Bantuan? Chat Admin
        </span>
      </a>

    </div>
  );
}