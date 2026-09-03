import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Modul untuk menangani penyimpanan file fisik ke server
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

async function registerUser(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const gradeInput = formData.get("class") as string; 
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string; // <-- Tangkap Alamat Lengkap
  const password = formData.get("password") as string;
  const file = formData.get("profilePhoto") as File; 

  if (!name || !email || !phone || !password) return;

  // 1. Daftarkan akun ke Supabase Auth terlebih dahulu agar mengirim verifikasi email
  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (authError) {
    console.error("GAGAL SUPABASE AUTH SIGNUP:", authError.message);
    throw new Error(authError.message);
  }

  let imageUrl = null;

  // 2. Logika Penyimpanan File Foto Profil Siswa (Opsional)
  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.name.split(".").pop();
      const fileName = `user-${uniqueSuffix}.${extension}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Gagal mengunggah foto profil siswa:", error);
    }
  }

  try {
    // 3. Simpan data user ke database Prisma beserta Alamat, SEKALIGUS buat data StudentProfile-nya
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        address,      // <-- Masukkan ke database
        password_hash: password, 
        role: "STUDENT", 
        image_url: imageUrl,
        
        profiles: {
          create: {
            name: name,
            level: "Umum",
            grade: gradeInput || "Belum diisi", 
          },
        },
      },
    });

  } catch (error) {
    console.error("GAGAL MENYIMPAN USER KE DATABASE PRISMA:", error);
    throw error;
  }

  // 4. Setelah daftar, arahkan ke halaman pemberitahuan agar siswa mengecek email verifikasi
  redirect("/login?message=check_email_verification");
}

export default function UserRegisterPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative flex items-center justify-center py-16 px-6">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-900/5 space-y-6 relative z-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>

          <div className="text-center">
            <Link href="/" className="inline-block mb-2">
              <img src="/logo.png" alt="Logo Temuguru" className="h-12 mx-auto object-contain" />
            </Link>
          </div>

          <div className="text-center mt-2 space-y-1">
            <h1 className="text-2xl font-black text-slate-900">Daftar Akun Siswa</h1>
            <p className="text-xs text-slate-500 font-medium">Buat akun untuk memesan guru privat impianmu.</p>
          </div>
        </div>

        <form action={registerUser} className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
            <input type="text" name="name" placeholder="Budi Santoso" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Kelas / Jenjang</label>
            <input type="text" name="class" placeholder="Contoh: Kelas 1 SD, 2 SMP, Umum" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
          </div>

          {/* INPUT ALAMAT LENGKAP */}
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Alamat Lengkap</label>
            <textarea 
              name="address" 
              rows={3} 
              placeholder="Contoh: Jl. Melati No. 12, RT 03/RW 04, Sidoarjo" 
              required 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none font-medium text-slate-800"
            ></textarea>
          </div>

          {/* INPUT FOTO PROFIL OPSIONAL */}
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Foto Profil <span className="text-slate-400 font-normal">(Opsional)</span></label>
            <input 
              type="file" 
              name="profilePhoto" 
              accept="image/*" 
              className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-slate-50 border border-slate-200 rounded-2xl" 
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Alamat Email</label>
            <input type="email" name="email" placeholder="budi@email.com" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Nomor WhatsApp</label>
            <input type="text" name="phone" placeholder="08123456789" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Kata Sandi</label>
            <input type="password" name="password" placeholder="••••••••" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5">
            <UserPlus className="w-4 h-4" /> Daftar Akun Baru
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium">
          Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Masuk</Link>
        </p>
      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20akun%20siswa." 
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