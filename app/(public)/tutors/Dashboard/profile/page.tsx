import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, CreditCard, DollarSign, AlertCircle, FileText, MapPin, GraduationCap, ShieldCheck, FileCheck, Upload, ExternalLink, Camera } from "lucide-react";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Modul untuk menyimpan file fisik ke folder public/uploads
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

async function updateProfile(formData: FormData) {
  "use server";
  
  // 1. Cek sesi login aktif via Supabase Auth
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return redirect("/tutors/login");
  }

  // 2. Cari tutor di Prisma berdasarkan email akun yang sedang login
  const currentTutor = await prisma.tutor.findFirst({
    where: { email: user.email.toLowerCase().trim() },
  });
  
  if (!currentTutor) return;

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const education = formData.get("education") as string;
  const bank_account = formData.get("bank_account") as string;
  const price_per_hour = parseInt(formData.get("price_per_hour") as string) || 0;

  // Tangkap file dari input type="file"
  const photoFile = formData.get("photoFile") as File;
  const ktpFile = formData.get("ktpFile") as File;
  const ijazahFile = formData.get("ijazahFile") as File;

  let photoUrl = currentTutor.photo_url;
  let ktpUrl = currentTutor.ktp_url;
  let ijazahUrl = currentTutor.ijazah_url;

  const uploadDir = join(process.cwd(), "public/uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // 1. Simpan Foto Profil
  if (photoFile && photoFile.size > 0 && photoFile.name !== "undefined") {
    try {
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = photoFile.name.split(".").pop();
      const fileName = `profile-${uniqueSuffix}.${extension}`;
      await writeFile(join(uploadDir, fileName), buffer);
      photoUrl = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Gagal upload foto profil:", error);
    }
  }

  // 2. Simpan File KTP
  if (ktpFile && ktpFile.size > 0 && ktpFile.name !== "undefined") {
    try {
      const bytes = await ktpFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = ktpFile.name.split(".").pop();
      const fileName = `ktp-${uniqueSuffix}.${extension}`;
      await writeFile(join(uploadDir, fileName), buffer);
      ktpUrl = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Gagal upload KTP:", error);
    }
  }

  // 3. Simpan File Ijazah
  if (ijazahFile && ijazahFile.size > 0 && ijazahFile.name !== "undefined") {
    try {
      const bytes = await ijazahFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = ijazahFile.name.split(".").pop();
      const fileName = `ijazah-${uniqueSuffix}.${extension}`;
      await writeFile(join(uploadDir, fileName), buffer);
      ijazahUrl = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Gagal upload Ijazah:", error);
    }
  }

  await prisma.tutor.updateMany({
    where: { email: user.email.toLowerCase().trim() },
    data: {
      name,
      bio,
      location,
      education,
      bank_account,
      price_per_hour,
      photo_url: photoUrl,
      ktp_url: ktpUrl,
      ijazah_url: ijazahUrl,
    },
  });

  revalidatePath("/tutors/dashboard");
  redirect("/tutors/dashboard");
}

export default async function TutorProfilePage() {
  // 1. Cek sesi login aktif via Supabase Auth
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    redirect("/tutors/login");
  }

  // 2. Ambil data tutor dari Prisma berdasarkan email
  const tutor = await prisma.tutor.findFirst({
    where: { email: user.email.toLowerCase().trim() },
  });

  if (!tutor) {
    redirect("/tutors/login?error=profile_not_found");
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative pb-20">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto space-y-6 relative z-10 pt-10 px-6">
        
        {/* HEADER NAVIGASI */}
        <div className="space-y-1">
          <Link href="/tutors/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs mb-4">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Pengaturan Profil & Verifikasi</h1>
          <p className="text-xs text-slate-500 font-medium">Lengkapi data diri dan unggah berkas verifikasi Anda.</p>
        </div>

        {/* STATUS AKUN */}
        {tutor.is_verified ? (
          <div className="bg-emerald-50/90 backdrop-blur-md border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Selamat! Akun Anda telah Terverifikasi oleh Admin Temuguru. Profil Anda tampil di pencarian publik.</span>
          </div>
        ) : (
          <div className="bg-amber-50/90 backdrop-blur-md border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-950 text-xs font-medium shadow-2xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-black">Akun Belum Terverifikasi</p>
              <p className="text-amber-900">Pilih dan unggah foto KTP & Ijazah Anda langsung dari HP/Laptop di bawah ini agar Admin dapat menyetujui akun Anda.</p>
            </div>
          </div>
        )}

        {/* FORM UPLOAD MULTIPART */}
        <form action={updateProfile} className="space-y-6">
          
          {/* SEKSI 1: UPLOAD DOKUMEN VERIFIKASI (KTP & IJAZAH) */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Upload Dokumen Verifikasi (KTP & Ijazah)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tombol Upload KTP */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-600" /> Foto KTP (Kartu Tanda Penduduk)
                </label>

                {tutor.ktp_url && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl shadow-2xs">
                    <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4 text-emerald-600" /> KTP Sudah Terunggah</span>
                    <a href={tutor.ktp_url} target="_blank" rel="noreferrer" className="underline font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                      Lihat <ExternalLink className="w-3 h-3"/>
                    </a>
                  </div>
                )}

                <input 
                  type="file" 
                  name="ktpFile" 
                  accept="image/*,.pdf" 
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-slate-50 border border-slate-200 rounded-2xl"
                />
                <p className="text-[10px] text-slate-400 font-medium">Pilih file foto KTP dari galeri/HP Anda.</p>
              </div>

              {/* Tombol Upload Ijazah */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-600" /> Foto Ijazah / Sertifikat
                </label>

                {tutor.ijazah_url && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl shadow-2xs">
                    <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4 text-emerald-600" /> Ijazah Sudah Terunggah</span>
                    <a href={tutor.ijazah_url} target="_blank" rel="noreferrer" className="underline font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                      Lihat <ExternalLink className="w-3 h-3"/>
                    </a>
                  </div>
                )}

                <input 
                  type="file" 
                  name="ijazahFile" 
                  accept="image/*,.pdf" 
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-slate-50 border border-slate-200 rounded-2xl"
                />
                <p className="text-[10px] text-slate-400 font-medium">Pilih file foto Ijazah dari galeri/HP Anda.</p>
              </div>

            </div>
          </div>

          {/* SEKSI 2: BIODATA & PROFIL SINGKAT */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Biodata & Latar Belakang</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Nama Lengkap
                </label>
                <input type="text" name="name" defaultValue={tutor.name} required className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Camera className="w-3.5 h-3.5 text-blue-600" /> Ganti Foto Profil
                </label>
                <input 
                  type="file" 
                  name="photoFile" 
                  accept="image/*" 
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-3 file:px-4 file:rounded-2xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-900 cursor-pointer bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Domisili / Kota
                </label>
                <input type="text" name="location" defaultValue={tutor.location || ""} placeholder="Contoh: Sidoarjo" className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Pendidikan Terakhir
                </label>
                <input type="text" name="education" defaultValue={tutor.education || ""} placeholder="Contoh: S1 Pendidikan Bahasa Arab" className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> Bio / Deskripsi Singkat
              </label>
              <textarea name="bio" defaultValue={tutor.bio || ""} rows={4} placeholder="Ceritakan pengalaman mengajar..." className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"></textarea>
            </div>
          </div>

          {/* SEKSI 3: TARIF & REKENING */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Tarif & Rekening Pencairan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Tarif Mengajar (Per Jam)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  <input type="number" name="price_per_hour" defaultValue={tutor.price_per_hour} required min="0" className="w-full text-sm font-black p-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Rekening Bank
                </label>
                <input type="text" name="bank_account" defaultValue={tutor.bank_account || ""} placeholder="Contoh: BCA 554554 a.n Nama" required className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5">
            <Save className="w-5 h-5" /> Simpan Perubahan Profil & Berkas
          </button>

        </form>
      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20pengaturan%20profil%20pengajar." 
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