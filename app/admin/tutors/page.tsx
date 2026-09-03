import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Settings, ArrowLeft, CheckCircle, Award, MapPin, Phone, DollarSign, Trash2, Edit3, FileCheck, ExternalLink } from "lucide-react";
import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

// Server Action untuk toggle status COD dengan revalidasi instan ke halaman publik
async function toggleCodStatus(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;
  const currentStatus = formData.get("currentStatus") === "true";

  await prisma.tutor.update({
    where: { id: tutorId },
    data: { is_cod_enabled: !currentStatus },
  });

  // Segarkan halaman admin dan halaman publik detail guru secara instan
  revalidatePath("/admin/tutors");
  revalidatePath("/tutors");
  revalidatePath(`/tutors/${tutorId}`);
}

// Server Action untuk menerima/verifikasi tutor yang join
async function acceptTutorJoin(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;

  await prisma.tutor.update({
    where: { id: tutorId },
    data: { is_verified: true, is_active: true },
  });

  revalidatePath("/admin/tutors");
  revalidatePath("/tutors");
  revalidatePath(`/tutors/${tutorId}`);
}

// Server Action baru untuk Menghapus Data Guru
async function deleteTutor(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;
  if (!tutorId) return;

  try {
    await prisma.tutor.delete({
      where: { id: tutorId },
    });
  } catch (error) {
    console.error("Gagal menghapus data guru:", error);
  }

  revalidatePath("/admin/tutors");
  revalidatePath("/tutors");
}

export default async function AdminTutorsPage() {
  const tutors = await prisma.tutor.findMany({
    include: {
      subjects: { include: { subject: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 font-sans text-slate-800 space-y-8">
      
      {/* NAVBAR HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="space-y-1">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Admin
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Kelola Data Guru Privat</h1>
          <p className="text-xs text-slate-500">Pusat kendali verifikasi, status COD, serta pengaturan mapel pengajar.</p>
        </div>
      </div>

      {/* DAFTAR KARTU GURU */}
      <div className="max-w-6xl mx-auto space-y-4">
        {tutors.length === 0 ? (
          <div className="bg-white border rounded-3xl p-16 text-center text-slate-400 text-sm italic shadow-sm">
            Belum ada data guru terdaftar di sistem.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tutors.map((tutor) => (
              <div 
                key={tutor.id} 
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                {/* INFO UTAMA GURU */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-extrabold text-slate-900 text-lg">{tutor.name}</h3>
                    
                    {/* Badge Verifikasi */}
                    {tutor.is_verified ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Terverifikasi & Aktif
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" /> Menunggu Persetujuan Join
                      </span>
                    )}

                    {/* Badge COD */}
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                      tutor.is_cod_enabled 
                        ? "bg-blue-50 text-blue-700 border-blue-100" 
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
                      COD: {tutor.is_cod_enabled ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {tutor.phone_wa}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {tutor.location}
                    </span>
                    <span>• Pendidikan: <strong className="text-slate-700">{tutor.education}</strong></span>
                  </div>

                  <div className="text-xs text-blue-600 font-bold bg-blue-50/60 border border-blue-100/50 px-3 py-1.5 rounded-xl w-fit">
                    Tarif Sesi: Rp {tutor.price_per_hour.toLocaleString("id-ID")} / jam
                  </div>

                  {/* LIHAT DOKUMEN VERIFIKASI (KTP & IJAZAH) */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {tutor.ktp_url ? (
                      <a 
                        href={tutor.ktp_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-blue-600" /> Cek KTP <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">KTP Belum Diunggah</span>
                    )}

                    {tutor.ijazah_url ? (
                      <a 
                        href={tutor.ijazah_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-blue-600" /> Cek Ijazah <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Ijazah Belum Diunggah</span>
                    )}
                  </div>
                </div>

                {/* TOMBOL AKSI & KELOLA */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  
                  {/* Tombol Terima Join jika belum verified */}
                  {!tutor.is_verified && (
                    <form action={acceptTutorJoin}>
                      <input type="hidden" name="tutorId" value={tutor.id} />
                      <button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> Terima Join
                      </button>
                    </form>
                  )}

                  {/* Tombol Toggle Status COD */}
                  <form action={toggleCodStatus}>
                    <input type="hidden" name="tutorId" value={tutor.id} />
                    <input type="hidden" name="currentStatus" value={String(tutor.is_cod_enabled)} />
                    <button 
                      type="submit" 
                      className={`text-xs font-bold px-4 py-3 rounded-2xl transition-all border flex items-center gap-1.5 shadow-sm ${
                        tutor.is_cod_enabled
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <DollarSign className="w-4 h-4" /> {tutor.is_cod_enabled ? "Matikan COD" : "Aktifkan COD"}
                    </button>
                  </form>

                  {/* Tombol Kelola Mapel Saja */}
                  <Link 
                    href={`/admin/tutors/${tutor.id}`}
                    className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Kelola Mapel
                  </Link>

                  {/* Tombol Edit Guru */}
                  <Link 
                    href={`/admin/tutors/edit/${tutor.id}`}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </Link>

                  {/* Tombol Hapus Guru */}
                  <form action={deleteTutor}>
                    <input type="hidden" name="tutorId" value={tutor.id} />
                    <button 
                      type="submit"
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
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