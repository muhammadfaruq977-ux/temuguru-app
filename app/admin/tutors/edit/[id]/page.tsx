import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Save } from "lucide-react";

// Server Action untuk memperbarui data guru
async function updateTutor(formData: FormData) {
  "use server";
  const tutorId = formData.get("tutorId") as string;
  const name = formData.get("name") as string;
  const education = formData.get("education") as string;
  const location = formData.get("location") as string;
  const phone_wa = formData.get("phone_wa") as string;
  const price_per_hour = Number(formData.get("price_per_hour"));
  const bio = formData.get("bio") as string;

  if (!tutorId) return;

  await prisma.tutor.update({
    where: { id: tutorId },
    data: {
      name,
      education,
      location,
      phone_wa,
      price_per_hour,
      bio,
    },
  });

  revalidatePath("/admin/tutors");
  revalidatePath(`/tutors/${tutorId}`);
  redirect("/admin/tutors");
}

export default async function EditTutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const tutorId = resolvedParams.id;

  // Ambil data guru berdasarkan ID
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
  });

  if (!tutor) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold text-red-600">Guru tidak ditemukan</h1>
        <Link href="/admin/tutors" className="text-blue-600 underline text-sm mt-2 inline-block">Kembali ke Daftar Guru</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 font-sans text-slate-800 space-y-8">
      
      {/* HEADER */}
      <div className="max-w-3xl mx-auto flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <Link href="/admin/tutors" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Kelola Guru
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Edit Data Guru: {tutor.name}</h1>
        </div>
      </div>

      {/* FORM EDIT */}
      <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <form action={updateTutor} className="space-y-6">
          <input type="hidden" name="tutorId" value={tutor.id} />

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={tutor.name} 
              required 
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Pendidikan / Gelar</label>
              <input 
                type="text" 
                name="education" 
                defaultValue={tutor.education} 
                required 
                className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Lokasi / Domisili</label>
              <input 
                type="text" 
                name="location" 
                defaultValue={tutor.location} 
                required 
                className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">No WhatsApp</label>
              <input 
                type="text" 
                name="phone_wa" 
                defaultValue={tutor.phone_wa} 
                required 
                className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Tarif Per Jam (Rp)</label>
              <input 
                type="number" 
                name="price_per_hour" 
                defaultValue={tutor.price_per_hour} 
                required 
                className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Bio / Deskripsi Singkat</label>
            <textarea 
              name="bio" 
              defaultValue={tutor.bio || ""} 
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-500" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/admin/tutors" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
              Batal
            </Link>
            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
              <Save className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}