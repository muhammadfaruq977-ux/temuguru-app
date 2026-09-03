import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, MapPin, BookOpen, Filter, ArrowRight, CheckCircle, CheckCircle2 } from "lucide-react";

export default async function TutorsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; location?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.query || "";
  const selectedLocation = resolvedParams.location || "";

  // 1. Ambil daftar unik lokasi yang ada di database untuk opsi dropdown secara otomatis
  const allTutorsForLocation = await prisma.tutor.findMany({
    where: { is_verified: true, is_active: true },
    select: { location: true },
  });
  
  // Ambil lokasi unik (hilangkan duplikat dan nilai kosong)
  const availableLocations = Array.from(
    new Set(allTutorsForLocation.map((t) => t.location).filter(Boolean))
  );

  // 2. Query filter guru berdasarkan pencarian (nama/mapel) dan lokasi
  const tutors = await prisma.tutor.findMany({
    where: {
      is_verified: true,
      is_active: true,
      AND: [
        searchQuery
          ? {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" } },
                {
                  subjects: {
                    some: {
                      subject: {
                        name: { contains: searchQuery, mode: "insensitive" },
                      },
                    },
                  },
                },
              ],
            }
          : {},
        selectedLocation
          ? { location: { equals: selectedLocation, mode: "insensitive" } }
          : {},
      ],
    },
    include: {
      subjects: {
        include: { subject: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative pb-24">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      {/* 1. Header & Top Bar (Navbar Konsisten) */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 md:px-12 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-xs">
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className="inline-block shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo Temuguru" 
              className="h-8 md:h-12 w-auto object-contain max-h-[48px]"
            />
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section (Banner & Form Pencarian Aktif) */}
      <div className="bg-blue-600 pt-12 pb-24 px-4 relative z-10 shadow-lg">
        <div className="container mx-auto max-w-6xl text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Temukan Guru Privat Terbaik
          </h1>
          <p className="text-blue-100 text-sm md:text-base mb-8 max-w-xl mx-auto font-medium">
            Ratusan pengajar profesional siap membantu Anda atau anak Anda mencapai target belajar yang diinginkan.
          </p>

          {/* Form Pencarian menggunakan GET agar otomatis masuk ke URL parameters */}
          <form method="GET" action="/tutors" className="bg-white/95 backdrop-blur-md p-3 rounded-[2rem] shadow-xl shadow-blue-900/20 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 border border-blue-200">
            <div className="flex-1 flex items-center bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                name="query"
                defaultValue={searchQuery}
                placeholder="Cari nama guru atau mata pelajaran..." 
                className="bg-transparent w-full outline-none text-sm text-slate-700 font-medium"
              />
            </div>

            <div className="flex-1 flex items-center bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
              <MapPin className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <select 
                name="location"
                defaultValue={selectedLocation}
                className="bg-transparent w-full outline-none text-sm text-slate-700 font-medium appearance-none cursor-pointer"
              >
                <option value="">Semua Lokasi</option>
                <option value="Online">Online</option>
                {/* Menampilkan lokasi secara dinamis dari database */}
                {availableLocations.map((loc) => (
                  loc !== "Online" && <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0">
              Cari <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Area Katalog Guru */}
      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-20">
        
        {/* Filter Cepat */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
            <Filter className="w-4 h-4 text-blue-600" /> Filter Cepat:
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/tutors" className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!searchQuery ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"}`}>
              Semua
            </Link>
            <Link href="/tutors?query=Matematika" className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Matematika
            </Link>
            <Link href="/tutors?query=Inggris" className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Bahasa Inggris
            </Link>
            <Link href="/tutors?query=Fisika" className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Fisika
            </Link>
          </div>
        </div>

        {/* Grid Kartu Guru */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tutors.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-black text-slate-900">Guru tidak ditemukan</h3>
              <p className="text-xs text-slate-500 font-medium">Coba gunakan kata kunci lain atau pilih lokasi yang berbeda.</p>
            </div>
          ) : (
            tutors.map((tutor) => (
              <div key={tutor.id} className="bg-white/90 backdrop-blur-md rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group">
                
                {/* Bagian Atas Kartu */}
                <div className="p-5 flex gap-4 border-b border-slate-100 relative">
                  <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Aktif
                  </div>

                  <div className="w-24 h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl overflow-hidden border border-slate-200 shrink-0 shadow-2xs">
                    {tutor.photo_url ? (
                      <img src={tutor.photo_url} alt={tutor.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      tutor.name.charAt(0)
                    )}
                  </div>
                  <div>
                    {/* NAMA DAN BADGE CENTANG */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tutor.is_verified && (
                        <span className="bg-blue-50 text-blue-600 p-0.5 rounded-full inline-flex items-center justify-center shrink-0 border border-blue-100" title="Pengajar Terverifikasi">
                          <CheckCircle2 className="w-4 h-4 fill-blue-600 text-white" />
                        </span>
                      )}
                      <h3 className="font-black text-slate-900 text-base line-clamp-1">{tutor.name}</h3>
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">{tutor.education}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {tutor.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bagian Tengah */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-slate-50/50 space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-black mb-2">Mengajar:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.subjects.length > 0 ? (
                        tutor.subjects.slice(0, 3).map(s => (
                          <span key={s.subject.id} className="bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-2xs">
                            {s.subject.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada mapel</span>
                      )}
                      {tutor.subjects.length > 3 && (
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                          +{tutor.subjects.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end pt-2 border-t border-slate-200/60">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Tarif Mulai Dari</p>
                      <p className="text-base font-black text-blue-600">Rp{tutor.price_per_hour.toLocaleString('id-ID')}<span className="text-[10px] text-slate-400 font-normal">/sesi</span></p>
                    </div>
                  </div>
                </div>

                {/* Bagian Bawah */}
                <div className="p-4 bg-white/90 border-t border-slate-100">
                  <Link 
                    href={`/tutors/${tutor.id}`}
                    className="block w-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold text-xs text-center py-3 rounded-xl transition-all border border-blue-100 hover:border-blue-600 shadow-2xs"
                  >
                    Lihat Profil & Jadwal
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20pencarian%20guru%20privat." 
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