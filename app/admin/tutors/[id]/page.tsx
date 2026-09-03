import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ArrowLeft, BookOpen, Calendar, Trash2, Plus, CheckCircle } from "lucide-react";

// 1. Server Action: Tambah Mata Pelajaran ke Guru
async function addSubjectToTutor(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;
  const subjectId = formData.get("subjectId") as string;
  const level = formData.get("level") as string;

  if (!tutorId || !subjectId) return;

  try {
    await prisma.tutorSubject.create({
      data: {
        tutor_id: tutorId,
        subject_id: subjectId,
        level: level || "SD, SMP, SMA",
      },
    });
  } catch (error) {
    console.error("Gagal menambah mapel:", error);
  }

  revalidatePath(`/admin/tutors/${tutorId}`);
}

// 2. Server Action: Hapus Mata Pelajaran dari Guru
async function removeTutorSubject(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;
  const subjectId = formData.get("subjectId") as string; // Ubah ini

  if (!tutorId || !subjectId) return;

  await prisma.tutorSubject.delete({
    where: { 
      tutor_id_subject_id: {
        tutor_id: tutorId,
        subject_id: subjectId
      }
    },
  });

  revalidatePath(`/admin/tutors/${tutorId}`);
}

// 3. Server Action: Tambah Jadwal Ketersediaan Guru
async function addScheduleToTutor(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;
  const dayOfWeek = Number(formData.get("day_of_week"));
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;

  if (!tutorId || isNaN(dayOfWeek) || !startTime || !endTime) return;

  await prisma.tutorSchedule.create({
    data: {
      tutor_id: tutorId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    },
  });

  revalidatePath(`/admin/tutors/${tutorId}`);
}

// 4. Server Action: Hapus Jadwal Guru
async function removeTutorSchedule(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;
  const scheduleId = formData.get("scheduleId") as string;

  if (!scheduleId) return;

  await prisma.tutorSchedule.delete({
    where: { id: scheduleId },
  });

  revalidatePath(`/admin/tutors/${tutorId}`);
}

export default async function AdminTutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const tutorId = resolvedParams.id;

  // Ambil data tutor beserta mapel dan jadwalnya
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: {
      subjects: {
        include: { subject: true },
      },
      schedules: true,
    },
  });

  // Ambil semua daftar master mata pelajaran untuk pilihan dropdown
  const allSubjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
  });

  if (!tutor) {
    return (
      <div className="p-10 text-center font-sans">
        <h1 className="text-xl font-bold text-red-600">Guru tidak ditemukan</h1>
        <Link href="/admin/tutors" className="text-blue-600 underline text-sm mt-2 inline-block">
          Kembali ke Daftar Guru
        </Link>
      </div>
    );
  }

  const daysList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 font-sans text-slate-800 space-y-8">
      
      {/* HEADER NAVIGASI */}
      <div className="max-w-6xl mx-auto flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <Link href="/admin/tutors" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Guru
        </Link>
        <Link href="/admin/tutors" className="text-xs font-bold bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition">
          Dashboard Admin
        </Link>
      </div>

      {/* PROFIL SINGKAT GURU */}
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
        <h1 className="text-2xl font-black text-slate-900">{tutor.name}</h1>
        <p className="text-xs text-slate-500 font-medium">
          No. WhatsApp: <span className="text-slate-800 font-bold">{tutor.phone_wa}</span> | Lokasi: <span className="text-slate-800 font-bold">{tutor.location}</span>
        </p>
        <p className="text-xs text-slate-500 font-medium">
          Pendidikan: <span className="text-slate-800 font-bold">{tutor.education} ({tutor.experience_years} tahun pengalaman)</span>
        </p>
      </div>

      {/* GRID UTAMA (KIRI: MAPEL, KANAN: JADWAL) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: MATA PELAJARAN */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Mata Pelajaran Guru</h2>
            </div>

           {/* Daftar Mapel yang Sudah Ada */}
            <div className="space-y-2">
              {tutor.subjects.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada mata pelajaran yang ditambahkan.</p>
              ) : (
                tutor.subjects.map((ts) => (
                  <div key={ts.subject_id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{ts.subject.name}</p>
                      <p className="text-[11px] text-slate-500">Level: {ts.level}</p>
                    </div>
                    <form action={removeTutorSubject}>
                      <input type="hidden" name="tutorId" value={tutor.id} />
                      {/* Ubah value-nya menjadi ts.subject_id */}
                      <input type="hidden" name="subjectId" value={ts.subject_id} />
                      <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Form Tambah Mapel */}
            <form action={addSubjectToTutor} className="space-y-4">
              <input type="hidden" name="tutorId" value={tutor.id} />
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pilih Mata Pelajaran</label>
                <select name="subjectId" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500">
                  <option value="">-- Pilih Mapel --</option>
                  {allSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jenjang Level</label>
                <input 
                  type="text" 
                  name="level" 
                  defaultValue="SD, SMP, SMA" 
                  required 
                  className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" 
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Mapel untuk Guru Ini
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: JADWAL KETERSEDIAAN */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900">Jadwal Ketersediaan Guru</h2>
            </div>

            {/* Daftar Jadwal yang Sudah Ada */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tutor.schedules.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada jadwal yang diatur.</p>
              ) : (
                tutor.schedules.map((sch) => (
                  <div key={sch.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{daysList[sch.day_of_week]}</p>
                      <p className="text-[11px] text-slate-500">{sch.start_time} - {sch.end_time} WIB</p>
                    </div>
                    <form action={removeTutorSchedule}>
                      <input type="hidden" name="tutorId" value={tutor.id} />
                      <input type="hidden" name="scheduleId" value={sch.id} />
                      <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Form Tambah Jadwal */}
            <form action={addScheduleToTutor} className="space-y-4">
              <input type="hidden" name="tutorId" value={tutor.id} />

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hari</label>
                <select name="day_of_week" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500">
                  <option value="1">Senin</option>
                  <option value="2">Selasa</option>
                  <option value="3">Rabu</option>
                  <option value="4">Kamis</option>
                  <option value="5">Jumat</option>
                  <option value="6">Sabtu</option>
                  <option value="0">Minggu</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jam Mulai</label>
                  <input type="text" name="start_time" defaultValue="08:00" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jam Selesai</label>
                  <input type="text" name="end_time" defaultValue="10:00" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Jadwal Guru
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}