import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Users, Mail, Phone, Shield, User as UserIcon, MapPin } from "lucide-react";

export default async function AdminUsersPage() {
  // Ambil semua data user dari database, diurutkan dari yang terbaru
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: {
      profiles: true,
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 p-6 md:p-10 space-y-8">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Panel Admin
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Manajemen Pengguna & Siswa</h1>
          <p className="text-xs text-slate-500">Daftar seluruh akun, kontak, dan alamat lengkap siswa yang terdaftar.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-xs font-bold border border-blue-100">
          Total Pengguna: {users.length} Akun
        </div>
      </div>

      {/* TABEL PENGGUNA */}
      <div className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="p-4 sm:p-6">Nama Pengguna</th>
                <th className="p-4 sm:p-6">Email & Kontak (WA)</th>
                <th className="p-4 sm:p-6">Alamat Lengkap Siswa</th>
                <th className="p-4 sm:p-6">Role / Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition align-top">
                  
                  {/* NAMA & JENJANG */}
                  <td className="p-4 sm:p-6 font-bold text-slate-900 flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 mt-0.5">
                      {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <span className="block text-slate-900">{u.name || "Tanpa Nama"}</span>
                      {u.profiles.length > 0 && (
                        <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                          Jenjang: {u.profiles[0].grade}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* EMAIL & TELEPON */}
                  <td className="p-4 sm:p-6 text-slate-600 text-xs font-medium space-y-1.5">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {u.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {u.phone || "-"}
                    </span>
                  </td>

                  {/* ALAMAT LENGKAP */}
                  <td className="p-4 sm:p-6 text-slate-600 text-xs max-w-xs">
                    {u.address ? (
                      <span className="flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> 
                        <span>{u.address}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Alamat belum diisi</span>
                    )}
                  </td>

                  {/* ROLE */}
                  <td className="p-4 sm:p-6">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full border ${
                      u.role === "ADMIN" 
                        ? "bg-purple-50 text-purple-700 border-purple-200" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {u.role === "ADMIN" ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3.5 h-3.5" />}
                      {u.role}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}