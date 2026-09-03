import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, LogOut, CheckCircle, CreditCard, ShieldCheck, User, Wallet, BookOpen, Clock, Banknote, Image as ImageIcon, Settings, AlertCircle, FileCheck, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import SidebarMenu from "@/components/SidebarMenu";
import PushNotificationButton from "@/components/PushNotificationButton";

// FUNGSI LOGOUT SUPABASE AUTH
async function handleTutorLogout() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Hapus juga cookie sisa jika ada
  const cookieStore = await cookies();
  cookieStore.delete("tutor_email");
  cookieStore.delete("tutor_phone");

  redirect("/tutors/login");
}

export default async function TutorDashboardPage() {
  // 1. Cek sesi login aktif dari Supabase Auth
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    redirect("/tutors/login");
  }

  // 2. Ambil data tutor dari Prisma berdasarkan email user yang sedang login
  const tutor = await prisma.tutor.findFirst({
    where: { 
      email: user.email.toLowerCase().trim() 
    },
    include: {
      subjects: { include: { subject: true } },
      bookings: {
        include: { subject: true, student: true },
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!tutor) {
    redirect("/tutors/login?error=profile_not_found");
  }

  // 3. Pastikan record User ada di Prisma untuk relasi PushSubscription
  let prismaUser = await prisma.user.findUnique({
    where: { email: tutor.email.toLowerCase().trim() },
  });

  if (!prismaUser) {
    prismaUser = await prisma.user.create({
      data: {
        email: tutor.email.toLowerCase().trim(),
        name: tutor.name,
        role: "TUTOR",
      },
    });
  }

  const PLATFORM_FEE_PERCENTAGE = 10;
  const TUTOR_CUT = (100 - PLATFORM_FEE_PERCENTAGE) / 100;

  const totalPendingPayout = tutor.bookings
    .filter((b) => b.status === "COMPLETED" && (b.payout_status === "WAITING_ADMIN" || !b.payout_status))
    .reduce((sum, b) => sum + Math.round(b.total_price * TUTOR_CUT), 0);

  const totalTransferred = tutor.bookings
    .filter((b) => b.status === "COMPLETED" && b.payout_status === "TRANSFERRED")
    .reduce((sum, b) => sum + Math.round(b.total_price * TUTOR_CUT), 0);

  const activeSessions = tutor.bookings.filter(
    (b) => b.status === "PAYMENT_SUCCESS" || b.status === "SCHEDULED" || b.status === "TUTOR_CONFIRMED"
  ).length;

  const isDocMissing = !tutor.ktp_url || !tutor.ijazah_url;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative pb-20">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      {/* HEADER NAVBAR DENGAN GARIS TIGA (SIDEBAR MENU) */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl overflow-hidden border border-blue-100 shrink-0 shadow-2xs">
              {tutor.photo_url ? (
                <img src={tutor.photo_url} alt={tutor.name} className="w-full h-full object-cover" />
              ) : (
                tutor.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                  Mitra Pengajar
                </span>
                {tutor.is_verified ? (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100 tracking-wider">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Terverifikasi
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-100 tracking-wider">
                    Belum Diberi Akses Publik
                  </span>
                )}
              </div>
              <h1 className="text-base font-black text-slate-900 mt-1">{tutor.name}</h1>
            </div>
          </div>

          {/* IKON GARIS TIGA (HAMBURGER MENU TIRAI) */}
          <div>
            <SidebarMenu>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Menu Utama</div>
              
              {/* TOMBOL AKTIFKAN NOTIFIKASI HP */}
              <div className="w-full">
                <PushNotificationButton userId={prismaUser.id} />
              </div>

              {/* TOMBOL PINTASAN ATUR JADWAL */}
              <Link href="/tutors/dashboard/schedule" className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold p-3.5 rounded-2xl transition-all border border-slate-200 flex items-center justify-between shadow-2xs cursor-pointer">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" /> Atur Jadwal
                </span>
                {activeSessions > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">
                    {activeSessions} Sesi
                  </span>
                )}
              </Link>

              <Link href="/tutors/dashboard/profile" className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold p-3.5 rounded-2xl transition-all border border-slate-200 flex items-center gap-2 shadow-2xs cursor-pointer">
                <Settings className="w-4 h-4 text-slate-500" /> Edit Profil & Verifikasi
              </Link>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <form action={handleTutorLogout} className="w-full">
                  <button type="submit" className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold p-3.5 rounded-2xl transition-all border border-red-100 flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </form>
              </div>
            </SidebarMenu>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-8 relative z-10">
        
        {/* PERINGATAN VERIFIKASI DOKUMEN (KTP & IJAZAH) */}
        {!tutor.is_verified && (
          <div className="bg-amber-50/90 backdrop-blur-md border border-amber-200 p-6 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl shadow-amber-900/5">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0 border border-amber-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-black text-amber-950 text-sm">
                  {isDocMissing ? "Unggah KTP & Ijazah Anda" : "Dokumen Sedang Diverifikasi Admin"}
                </h3>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  {isDocMissing 
                    ? "Lengkapi foto KTP & Ijazah di menu Pengaturan Profil agar Admin dapat memverifikasi profil Anda." 
                    : "Dokumen Anda sudah lengkap. Admin Temuguru sedang meninjau profil Anda sebelum ditampilkan secara publik."}
                </p>
              </div>
            </div>
            <Link 
              href="/tutors/dashboard/profile"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center cursor-pointer"
            >
              <FileCheck className="w-4 h-4" /> 
              {isDocMissing ? "Unggah Dokumen" : "Cek Kelengkapan Profil"} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* WIDGET STATISTIK PENDAPATAN & AKUN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-orange-900/10 text-white space-y-3 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-amber-100 uppercase tracking-wider">
                  <Clock className="w-4 h-4" /> Menunggu Transfer
                </div>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/20">
                  Fee -{PLATFORM_FEE_PERCENTAGE}%
                </span>
              </div>
              <p className="text-3xl font-black mt-2">Rp {totalPendingPayout.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/10 text-white space-y-3 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-100 uppercase tracking-wider">
                <Wallet className="w-4 h-4" /> Total Berhasil Cair
              </div>
              <p className="text-3xl font-black mt-2">Rp {totalTransferred.toLocaleString("id-ID")}</p>
            </div>
            <ShieldCheck className="w-32 h-32 text-white/10 absolute -right-6 -bottom-6 pointer-events-none" />
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                <User className="w-4 h-4 text-blue-600" /> Tarif Dasar (Kotor)
              </div>
              <p className="text-xl font-black text-slate-900">Rp {tutor.price_per_hour.toLocaleString("id-ID")} <span className="text-xs text-slate-500 font-medium">/ jam</span></p>
            </div>
            <div className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-3 rounded-2xl flex items-center justify-between border border-blue-100 shadow-2xs">
              <span>Sesi Sedang Berjalan:</span>
              <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-xl font-black">{activeSessions}</span>
            </div>
          </div>
        </div>

        {/* DAFTAR JADWAL / RIWAYAT MENGAJAR */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5">
            <h2 className="text-xl font-black text-slate-900">Riwayat & Jadwal Mengajar</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Kelola sesi bimbingan belajar dan pantau status pencairan honorarium Anda.</p>
          </div>
          
          {tutor.bookings.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-12 text-center space-y-3 shadow-xl shadow-blue-900/5">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-black text-slate-900 text-base">Belum ada jadwal mengajar</h3>
              <p className="text-xs text-slate-400 font-medium">Jadwal dari siswa akan otomatis muncul di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutor.bookings.map((booking: any) => {
                const isCompleted = booking.status === "COMPLETED";
                const isCod = booking.payment_method === "COD_CASH";
                const netIncomePerSession = Math.round(booking.total_price * TUTOR_CUT);
                
                const isWaitingAdmin = isCompleted && (booking.payout_status === "WAITING_ADMIN" || !booking.payout_status);
                const isTransferred = isCompleted && booking.payout_status === "TRANSFERRED";

                return (
                  <div key={booking.id} className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          Kode: {booking.booking_code}
                        </span>
                        <h3 className="font-black text-xl text-slate-900 mt-2">{booking.student?.name}</h3>
                      </div>
                      
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border text-center shrink-0 ${
                        isTransferred ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        isWaitingAdmin ? "bg-amber-50 text-amber-700 border-amber-200" :
                        booking.status === "PAYMENT_SUCCESS" || booking.status === "SCHEDULED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {isTransferred ? "Dana Cair" : isWaitingAdmin ? "Menunggu Admin" : booking.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100"><BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" /> <span className="font-bold text-slate-800">{booking.subject?.name}</span></p>
                        <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100"><Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" /> <span className="font-bold text-slate-800">{booking.start_time} WIB</span></p>
                        <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {isCod ? <Banknote className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          <span className="font-bold text-slate-800 uppercase text-[10px]">{booking.payment_method?.replace("_", " ")}</span>
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 flex flex-col justify-center">
                        <p className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                          <span>Nilai Sesi</span>
                          <span className="line-through decoration-slate-300">Rp {booking.total_price.toLocaleString("id-ID")}</span>
                        </p>
                        <div className="h-px w-full bg-slate-200"></div>
                        <p className="flex justify-between items-center text-xs font-black text-emerald-600">
                          <span>Diterima</span>
                          <span>Rp {netIncomePerSession.toLocaleString("id-ID")}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      {isTransferred ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex justify-between items-center shadow-2xs">
                          <p className="text-[11px] font-extrabold text-emerald-900 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Admin telah mentransfer dana.
                          </p>
                          {booking.payout_receipt && (
                            <a href={booking.payout_receipt} target="_blank" rel="noreferrer" className="text-[10px] font-black bg-white text-emerald-700 border border-emerald-300 px-3.5 py-2 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs">
                              <ImageIcon className="w-3.5 h-3.5"/> Lihat Bukti
                            </a>
                          )}
                        </div>
                      ) : isWaitingAdmin ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-2xs">
                          <p className="text-[11px] font-extrabold text-amber-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0" /> Sesi selesai. Menunggu admin mentransfer dana ke rekening Anda.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-2xs">
                          <p className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" /> Dana Escrow ditahan oleh sistem hingga sesi selesai.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20dashboard%20pengajar." 
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