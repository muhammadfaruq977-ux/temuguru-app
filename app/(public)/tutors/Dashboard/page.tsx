import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Calendar, LogOut, CheckCircle, CreditCard, ShieldCheck, User, Wallet, BookOpen, Clock, Banknote } from "lucide-react";

async function handleTutorLogout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("tutor_phone");
  redirect("/tutors/login");
}

export default async function TutorDashboardPage() {
  const cookieStore = await cookies();
  const tutorPhone = cookieStore.get("tutor_phone")?.value;

  if (!tutorPhone) {
    redirect("/tutors/login");
  }

  const tutor = await prisma.tutor.findFirst({
    where: { 
      phone_wa: { 
        contains: tutorPhone.trim() 
      } 
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
    redirect("/tutors/login");
  }

  const totalEarnings = tutor.bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.total_price, 0);

  const activeSessions = tutor.bookings.filter(
    (b) => b.status === "PAYMENT_SUCCESS" || b.status === "SCHEDULED" || b.status === "TUTOR_CONFIRMED"
  ).length;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-16">
      
      {/* HEADER NAVBAR */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl overflow-hidden border border-blue-100 shrink-0">
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
                {tutor.is_verified && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100 tracking-wider">
                    <CheckCircle className="w-3 h-3" /> Terverifikasi
                  </span>
                )}
              </div>
              <h1 className="text-base font-black text-slate-900 mt-1">{tutor.name}</h1>
            </div>
          </div>

          <form action={handleTutorLogout} className="w-full sm:w-auto">
            <button type="submit" className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-red-100 flex items-center justify-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Keluar Akun
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-8">
        
        {/* WIDGET STATISTIK PENDAPATAN & AKUN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1: Saldo Escrow (Dana Tersedia) */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-md text-white space-y-3 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-black text-blue-200 uppercase tracking-wider">
                <Wallet className="w-4 h-4" /> Saldo Pendapatan
              </div>
              <p className="text-3xl font-black mt-2">Rp {totalEarnings.toLocaleString("id-ID")}</p>
              <p className="text-[11px] text-blue-100 mt-2 leading-relaxed">
                Dana dari sesi yang telah diselesaikan oleh siswa. Siap dicairkan ke rekening Anda.
              </p>
            </div>
            <ShieldCheck className="w-32 h-32 text-white/5 absolute -right-6 -bottom-6" />
          </div>

          {/* Box 2: Rekening Pencairan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Rekening Pencairan
            </div>
            <div>
              <p className="text-base font-black text-slate-900">{tutor.bank_account || "Belum Diatur"}</p>
              <p className="text-[11px] text-slate-500 mt-1">Pastikan rekening valid untuk mempermudah transfer dari admin.</p>
            </div>
          </div>

          {/* Box 3: Status & Sesi Aktif */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                <User className="w-4 h-4 text-amber-600" /> Tarif & Sesi Aktif
              </div>
              <p className="text-base font-black text-slate-900">Rp {tutor.price_per_hour.toLocaleString("id-ID")} <span className="text-xs text-slate-500 font-medium">/ jam</span></p>
            </div>
            <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-between border border-blue-100">
              <span>Sesi Sedang Berjalan:</span>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-lg">{activeSessions}</span>
            </div>
          </div>
        </div>

        {/* DAFTAR JADWAL / RIWAYAT MENGAJAR */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Riwayat & Jadwal Mengajar</h2>
          
          {tutor.bookings.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3 shadow-sm">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">Belum ada jadwal mengajar</h3>
              <p className="text-xs text-slate-400">Jadwal dari siswa akan otomatis muncul di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutor.bookings.map((booking: any) => {
                const isCompleted = booking.status === "COMPLETED";
                const isCod = booking.payment_method === "COD_CASH";

                return (
                  <div key={booking.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Kode: {booking.booking_code}
                        </span>
                        <h3 className="font-extrabold text-lg text-slate-900 mt-2">{booking.student?.name}</h3>
                      </div>
                      
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border text-center ${
                        isCompleted ? "bg-purple-50 text-purple-700 border-purple-200" :
                        booking.status === "PAYMENT_SUCCESS" || booking.status === "SCHEDULED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {isCompleted ? "Sesi Selesai" : booking.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                      <div className="space-y-2">
                        <p className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-blue-600" /> {booking.subject?.name}</p>
                        <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600" /> {booking.start_time} WIB</p>
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center gap-1.5">
                          {isCod ? <Banknote className="w-3.5 h-3.5 text-amber-600" /> : <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                          {booking.payment_method?.replace("_", " ")}
                        </p>
                        <p className="flex items-center gap-1.5 font-bold text-slate-900">
                          Rp {booking.total_price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border text-[11px] font-bold flex items-center gap-2 ${
                      isCompleted 
                      ? "bg-purple-50 border-purple-100 text-purple-700" 
                      : "bg-slate-50 border-slate-100 text-slate-500"
                    }`}>
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                          Dana telah dilepas dan masuk ke Saldo Pendapatan Anda.
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                          Dana Escrow ditahan oleh sistem hingga sesi selesai.
                        </>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}