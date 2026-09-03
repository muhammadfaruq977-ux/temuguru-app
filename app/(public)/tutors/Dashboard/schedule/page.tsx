import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Nama hari dalam bahasa Indonesia (0 = Minggu, 1 = Senin, dst.)
const DAYS = [
  { id: 0, name: "Minggu" },
  { id: 1, name: "Senin" },
  { id: 2, name: "Selasa" },
  { id: 3, name: "Rabu" },
  { id: 4, name: "Kamis" },
  { id: 5, name: "Jumat" },
  { id: 6, name: "Sabtu" },
];

// SERVER ACTION: Tambah Jadwal Baru
async function addSchedule(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return redirect("/tutors/login");

  const tutor = await prisma.tutor.findFirst({
    where: { email: user.email.toLowerCase().trim() },
  });
  if (!tutor) return;

  const day_of_week = Number(formData.get("day_of_week"));
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;

  if (!start_time || !end_time) return;

  await prisma.tutorSchedule.create({
    data: {
      tutor_id: tutor.id,
      day_of_week,
      start_time,
      end_time,
      is_available: true,
    },
  });

  revalidatePath("/tutors/dashboard/schedule");
}

// SERVER ACTION: Hapus Jadwal
async function deleteSchedule(formData: FormData) {
  "use server";

  const scheduleId = formData.get("schedule_id") as string;
  if (!scheduleId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return redirect("/tutors/login");

  const tutor = await prisma.tutor.findFirst({
    where: { email: user.email.toLowerCase().trim() },
  });
  if (!tutor) return;

  // Pastikan jadwal milik tutor yang sedang login
  await prisma.tutorSchedule.deleteMany({
    where: {
      id: scheduleId,
      tutor_id: tutor.id,
    },
  });

  revalidatePath("/tutors/dashboard/schedule");
}

export default async function TutorSchedulePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    redirect("/tutors/login");
  }

  const tutor = await prisma.tutor.findFirst({
    where: { email: user.email.toLowerCase().trim() },
    include: {
      schedules: {
        orderBy: [{ day_of_week: "asc" }, { start_time: "asc" }],
      },
    },
  });

  if (!tutor) {
    redirect("/tutors/login");
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative pb-20">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10 pt-10 px-6">
        
        {/* Header Navigasi */}
        <div className="space-y-1">
          <Link href="/tutors/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs mb-4">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Atur Jadwal Ketersediaan Mengajar</h1>
          <p className="text-xs text-slate-500 font-medium">Tentukan hari dan jam operasional Anda agar siswa dapat memesan sesi dengan tepat.</p>
        </div>

        {/* Grid Layout: Form Tambah & List Jadwal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI: FORM TAMBAH JADWAL */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 space-y-5 h-fit">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider">Tambah Slot Waktu</h2>
            </div>

            <form action={addSchedule} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Hari</label>
                <select 
                  name="day_of_week" 
                  required 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                >
                  {DAYS.map((day) => (
                    <option key={day.id} value={day.id}>{day.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Jam Mulai</label>
                  <input 
                    type="time" 
                    name="start_time" 
                    required 
                    defaultValue="08:00"
                    className="w-full px-3 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Jam Selesai</label>
                  <input 
                    type="time" 
                    name="end_time" 
                    required 
                    defaultValue="10:00"
                    className="w-full px-3 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-0.5 mt-2"
              >
                <Plus className="w-4 h-4" /> Simpan Slot Jadwal
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: DAFTAR JADWAL AKTIF */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-base font-black text-slate-900 tracking-tight">Daftar Jadwal Anda Saat Ini</h2>

            {tutor.schedules.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-12 text-center space-y-3 shadow-xl shadow-blue-900/5">
                <Clock className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-black text-slate-900 text-base">Belum ada jadwal yang ditambahkan</h3>
                <p className="text-xs text-slate-400 font-medium">Gunakan form di sebelah kiri untuk menambahkan waktu ketersediaan Anda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tutor.schedules.map((schedule) => {
                  const dayName = DAYS.find((d) => d.id === schedule.day_of_week)?.name || "Hari";
                  return (
                    <div 
                      key={schedule.id} 
                      className="bg-white/90 backdrop-blur-md border border-slate-100 p-5 rounded-2xl shadow-xl shadow-blue-900/5 flex items-center justify-between gap-4 transition-all hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 border border-blue-100 shadow-2xs">
                          {dayName.slice(0, 3)}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-black text-slate-900 text-sm">{dayName}</h4>
                          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600" /> {schedule.start_time} - {schedule.end_time} WIB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tersedia
                        </span>

                        <form action={deleteSchedule}>
                          <input type="hidden" name="schedule_id" value={schedule.id} />
                          <button 
                            type="submit" 
                            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-100 cursor-pointer shadow-2xs"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20pengaturan%20jadwal%20mengajar." 
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