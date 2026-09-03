import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus, BookOpen, Layers, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

// Server Action untuk menambah mata pelajaran baru
async function createSubject(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;

  if (!name || !category) return;

  try {
    await prisma.subject.create({
      data: {
        name,
        category,
      },
    });
  } catch (error) {
    console.error("Gagal menambah mata pelajaran:", error);
  }

  revalidatePath("/admin/subjects");
}

// Server Action untuk menghapus mata pelajaran
async function deleteSubject(formData: FormData) {
  "use server";
  const subjectId = formData.get("subjectId") as string;

  if (!subjectId) return;

  try {
    await prisma.subject.delete({
      where: { id: subjectId },
    });
  } catch (error) {
    console.error("Gagal menghapus mata pelajaran:", error);
  }

  revalidatePath("/admin/subjects");
}

export default async function AdminSubjectsPage() {
  // Ambil semua daftar mata pelajaran dari database
  const subjects = await prisma.subject.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 font-sans text-slate-800 space-y-8">
      
      {/* NAVBAR HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="space-y-1">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Admin
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Kelola Mata Pelajaran</h1>
          <p className="text-xs text-slate-500">Tambah dan atur daftar mata pelajaran yang tersedia untuk les privat.</p>
        </div>
      </div>

      {/* KONTEN UTAMA: FORM TAMBAH & DAFTAR MAPEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORM TAMBAH MAPEL BARU */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-base text-slate-900">Tambah Mapel Baru</h2>
          </div>

          <form action={createSubject} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Mata Pelajaran</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Contoh: Matematika, Fisika, Al-Quran" 
                required 
                className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all" 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kategori / Kelompok</label>
              <select 
                name="category" 
                required 
                className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Akademik / Sekolah">Akademik / Sekolah</option>
                <option value="Bahasa Asing">Bahasa Asing</option>
                <option value="Keagamaan / Ngaji">Keagamaan / Ngaji</option>
                <option value="Kesenian & Keterampilan">Kesenian & Keterampilan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" /> Simpan Mata Pelajaran
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR MATA PELAJARAN */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-400" /> Daftar Mata Pelajaran ({subjects.length})
            </h2>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-700">Belum ada mata pelajaran</p>
              <p className="text-xs text-slate-400">Silakan tambahkan melalui form di samping.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjects.map((sub) => (
                <div 
                  key={sub.id} 
                  className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm">{sub.name}</h3>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full inline-block">
                      {sub.category}
                    </span>
                  </div>

                  <form action={deleteSubject}>
                    <input type="hidden" name="subjectId" value={sub.id} />
                    <button 
                      type="submit" 
                      title="Hapus Mapel"
                      className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl border border-slate-200 transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}