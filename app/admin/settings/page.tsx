import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Settings, CheckCircle, ShieldAlert } from "lucide-react";
import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

// Server Action untuk mengubah status COD
async function toggleCodSetting(formData: FormData) {
  "use server";
  const isEnabled = formData.get("isEnabled") === "true";

  await prisma.setting.upsert({
    where: { key: "COD_ENABLED" },
    update: { value: isEnabled ? "true" : "false" },
    create: { key: "COD_ENABLED", value: isEnabled ? "true" : "false" },
  });

  // Segarkan cache agar perubahan langsung berlaku di seluruh website
  revalidatePath("/admin/settings");
  revalidatePath("/tutors");
}

export default async function AdminSettingsPage() {
  // Ambil status COD terbaru dari database
  const codSetting = await prisma.setting.findUnique({
    where: { key: "COD_ENABLED" },
  });
  const isCodActive = codSetting ? codSetting.value === "true" : true;

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 font-sans text-slate-800 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="space-y-1">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Admin
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
              Panel Pengaturan Sistem
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Pengaturan Metode Pembayaran</h1>
          <p className="text-xs text-slate-500">Atur ketersediaan metode pembayaran tunai (COD) untuk seluruh siswa.</p>
        </div>
      </div>

      {/* KARTU PENGATURAN COD */}
      <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">Fitur Pembayaran COD (Cash on Delivery)</h2>
            <p className="text-xs text-slate-400">Aktifkan atau nonaktifkan opsi bayar tunai langsung ke guru.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">Status Saat Ini:</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isCodActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                isCodActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {isCodActive ? "AKTIF (Siswa Bisa Memilih COD)" : "NONAKTIF (COD Disembunyikan)"}
              </span>
            </div>
          </div>

          <form action={toggleCodSetting}>
            <input type="hidden" name="isEnabled" value={isCodActive ? "false" : "true"} />
            <button 
              type="submit" 
              className={`text-xs font-bold px-5 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 ${
                isCodActive 
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {isCodActive ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {isCodActive ? "Matikan Fitur COD" : "Aktifkan Fitur COD"}
            </button>
          </form>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          * Catatan: Jika fitur COD dimatikan, opsi bayar tunai akan otomatis hilang dari halaman detail guru, dan siswa tidak akan bisa memilih metode pembayaran tersebut.
        </p>
      </div>

    </div>
  );
}