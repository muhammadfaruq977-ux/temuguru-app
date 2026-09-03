import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User as UserIcon, Mail, Phone, GraduationCap, BookOpen, MapPin } from "lucide-react";
import { revalidatePath } from "next/cache";

async function updateStudentProfile(formData: FormData) {
  "use server";
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;
  if (!userEmail) return;

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string; // <-- Hanya menangkap Alamat
  const level = formData.get("level") as string;
  const grade = formData.get("grade") as string;
  const notes = formData.get("notes") as string;

  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!user) return;

  // Update data User utama (termasuk alamat)
  await prisma.user.update({
    where: { email: userEmail },
    data: { name, phone, address },
  });

  // Update atau buat StudentProfile terkait
  await prisma.studentProfile.updateMany({
    where: { user_id: user.id },
    data: { name, level, grade, notes },
  });

  revalidatePath("/dashboard/profile");
  redirect("/dashboard");
}

export default async function StudentProfilePage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) redirect("/login");

  const studentUser = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      profiles: true,
    },
  });

  if (!studentUser) redirect("/login");

  const studentProfile = studentUser.profiles[0];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative pb-20">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto space-y-6 relative z-10 pt-10 px-6">
        
        {/* HEADER NAVIGASI */}
        <div className="space-y-1">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs mb-4">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Siswa
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Pengaturan Profil & Lokasi Siswa</h1>
          <p className="text-xs text-slate-500 font-medium">Kelola informasi akun, data akademik, dan alamat tujuan les privat.</p>
        </div>

        {/* FORM UPDATE PROFIL */}
        <form action={updateStudentProfile} className="space-y-6">
          
          {/* INFORMASI AKUN */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Informasi Akun</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" /> Nama Lengkap
                </label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={studentUser.name} 
                  required 
                  className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Email (Tidak dapat diubah)
                </label>
                <input 
                  type="email" 
                  defaultValue={studentUser.email} 
                  disabled 
                  className="w-full text-sm font-medium p-3.5 border border-slate-200 rounded-2xl bg-slate-100 text-slate-500 cursor-not-allowed" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> Nomor Telepon / WhatsApp
                </label>
                <input 
                  type="text" 
                  name="phone" 
                  defaultValue={studentUser.phone || ""} 
                  className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          {/* INFORMASI LOKASI & ALAMAT (UNTUK GURU) */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Alamat Les Privat
            </h2>
            <p className="text-xs text-slate-500 -mt-2 font-medium">
              Alamat ini akan digunakan oleh admin untuk diberikan kepada guru yang berkunjung ke rumah Anda.
            </p>

            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                Alamat Lengkap (Nama Jalan, No. Rumah, RT/RW, Patokan)
              </label>
              <textarea 
                name="address" 
                defaultValue={studentUser.address || ""} 
                rows={3} 
                placeholder="Contoh: Jl. Melati No. 12, RT 03/RW 04, Sidoarjo (Depan masjid al-ikhlas)" 
                className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all"
              ></textarea>
            </div>
          </div>

          {/* DETAIL AKADEMIK SISWA */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Detail Akademik Siswa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Jenjang (Level)
                </label>
                <input 
                  type="text" 
                  name="level" 
                  defaultValue={studentProfile?.level || ""} 
                  placeholder="Contoh: SD, SMP, SMA" 
                  className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Kelas
                </label>
                <input 
                  type="text" 
                  name="grade" 
                  defaultValue={studentProfile?.grade || ""} 
                  placeholder="Contoh: Kelas 5, Kelas 10" 
                  className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                Catatan Tambahan Belajar
              </label>
              <textarea 
                name="notes" 
                defaultValue={studentProfile?.notes || ""} 
                rows={3} 
                placeholder="Catatan khusus atau kelemahan mata pelajaran..." 
                className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all"
              ></textarea>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5">
            <Save className="w-5 h-5" /> Simpan Perubahan Profil & Lokasi
          </button>

        </form>
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