import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ArrowLeft, Plus, Clock, User, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

// Server Action untuk menghapus jadwal jika diperlukan
async function deleteSchedule(formData: FormData) {
  "use server";
  const scheduleId = formData.get("scheduleId") as string;
  if (!scheduleId) return;

  try {
    await prisma.tutorSchedule.delete({
      where: { id: scheduleId },
    });
  } catch (error) {
    console.error("Gagal menghapus jadwal:", error);
  }

  revalidatePath("/admin/schedules");
}

export default async function AdminSchedulesPage() {
  // Ambil semua daftar jadwal beserta data guru terkait
  const schedules = await prisma.tutorSchedule.findMany({
    include: {
      tutor: true,
    },
    orderBy: { created_at: "desc" },
  });

  const daysName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 font-sans text-slate-800 space-y-8">
      
      {/* NAVBAR HEADER DENGAN TOMBOL KEMBALI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="space-y-1">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Admin
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
              Panel Admin Temuguru
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Jadwal Ketersediaan Guru</h1>
          <p className="text-xs text-slate-500">Daftar seluruh slot waktu dan jadwal mengajar pengajar privat.</p>
        </div>
      </div>

      {/* DAFTAR KARTU JADWAL */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">Semua Slot Jadwal Guru</h2>
            <p className="text-xs text-slate-400">Total slot aktif terdaftar: {schedules.length} jadwal</p>
          </div>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-sm text-slate-700">Belum ada jadwal yang diatur</p>
            <p className="text-xs text-slate-400">Anda dapat menambahkan jadwal melalui halaman detail masing-masing guru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((sch) => (
              <div 
                key={sch.id} 
                className="bg-slate-50/60 border border-slate-100 p-5 rounded-3xl space-y-4 hover:shadow-md hover:bg-white transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-black px-3 py-1 rounded-xl">
                      {daysName[sch.day_of_week]}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                      {sch.is_available ? "Tersedia" : "Penuh"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-slate-900 font-extrabold text-base">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{sch.start_time} - {sch.end_time} WIB</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100 mt-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Guru: <strong className="text-slate-900">{sch.tutor?.name || "Guru Tidak Dikenal"}</strong></span>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100/60">
                  <form action={deleteSchedule}>
                    <input type="hidden" name="scheduleId" value={sch.id} />
                    <button 
                      type="submit" 
                      title="Hapus Jadwal"
                      className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 p-2.5 rounded-2xl border border-slate-200 transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Slot
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}