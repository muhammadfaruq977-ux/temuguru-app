import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Wallet, BookOpen, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import SidebarMenu from "@/components/SidebarMenu";
import PushNotificationButton from "@/components/PushNotificationButton";

// Server Action untuk Logout Admin
async function handleLogout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("user_email");
  redirect("/login");
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  const user = await prisma.user.findUnique({
    where: { email: userEmail || "" },
  });

  if (!user) redirect("/login");

  // Hitung jumlah mitra guru yang belum diverifikasi
  const unverifiedTutorsCount = await prisma.tutor.count({
    where: { is_verified: false },
  });

  // Hitung jumlah pesanan selesai yang menunggu transfer admin (payout)
  const pendingPayoutsCount = await prisma.booking.count({
    where: {
      status: "COMPLETED",
      OR: [
        { payout_status: "WAITING_ADMIN" },
        { payout_status: null }
      ]
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative flex flex-col items-center justify-center p-6 md:p-10">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-6xl w-full space-y-6 relative z-10">
        
        {/* HEADER DENGAN TOMBOL KELUAR & SIDEBAR MENU */}
        <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 p-8 md:p-10 rounded-[2.5rem] overflow-hidden shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10 space-y-2 pr-12 md:pr-0">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-blue-100 text-[10px] font-black px-3.5 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Panel
            </span>
            <h1 className="text-3xl font-black tracking-tight">Halo, {user.name || "Admin"}! 👋</h1>
            <p className="text-blue-100 text-xs md:text-sm font-medium max-w-md">Selamat datang kembali di pusat kendali platform. Pantau performa mitra dan transaksi Anda hari ini.</p>
          </div>

          <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
            {/* Tombol Logout Cepat (Desktop) */}
            <form action={handleLogout} className="w-full md:w-auto hidden md:block">
              <button 
                type="submit" 
                className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-4 rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-2 backdrop-blur-sm shadow-sm cursor-pointer hover:scale-105"
              >
                <LogOut className="w-4 h-4" /> Keluar Akun
              </button>
            </form>

            {/* Menu Garis Tiga (Drawer) di pojok Kanan Atas */}
            <div className="absolute md:relative top-6 md:top-auto right-6 md:right-auto">
              <SidebarMenu>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Menu Admin</div>
                
                {/* TOMBOL AKTIFKAN NOTIFIKASI HP UNTUK ADMIN */}
                <div className="w-full">
                  <PushNotificationButton userId={user.id} />
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <form action={handleLogout} className="w-full">
                    <button type="submit" className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold p-3.5 rounded-2xl transition-all border border-red-100 flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                      <LogOut className="w-4 h-4" /> Keluar Akun
                    </button>
                  </form>
                </div>
              </SidebarMenu>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-5 pointer-events-none">
             <LayoutDashboard className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* MENU NAVIGASI CEPAT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/users" className="bg-white/90 backdrop-blur-md p-5 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all flex items-center gap-3.5 group">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-2xs group-hover:scale-110 transition-transform"><Users className="w-5 h-5" /></div>
            <span className="font-black text-sm text-slate-900">Pengguna</span>
          </Link>

          <Link href="/admin/bookings" className="relative bg-white/90 backdrop-blur-md p-5 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all flex items-center gap-3.5 group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-2xs group-hover:scale-110 transition-transform"><Wallet className="w-5 h-5" /></div>
            <span className="font-black text-sm text-slate-900">Pesanan</span>
            {pendingPayoutsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg animate-pulse">
                {pendingPayoutsCount}
              </span>
            )}
          </Link>

          <Link href="/admin/tutors" className="relative bg-white/90 backdrop-blur-md p-5 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all flex items-center gap-3.5 group">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-2xs group-hover:scale-110 transition-transform"><Users className="w-5 h-5" /></div>
            <span className="font-black text-sm text-slate-900">Mitra Guru</span>
            {unverifiedTutorsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg animate-pulse">
                {unverifiedTutorsCount} Baru
              </span>
            )}
          </Link>

          <Link href="/admin/subjects" className="bg-white/90 backdrop-blur-md p-5 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all flex items-center gap-3.5 group">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-2xs group-hover:scale-110 transition-transform"><BookOpen className="w-5 h-5" /></div>
            <span className="font-black text-sm text-slate-900">Mapel</span>
          </Link>
        </div>

        {/* FOOTER */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Temuguru Admin Panel v1.0</p>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20butuh%20bantuan%20teknis%20pada%20panel%20admin." 
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