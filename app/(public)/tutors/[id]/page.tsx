import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { Star, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

// IMPORT FUNGSI PENGIRIM NOTIFIKASI
import { sendPushNotification } from "@/lib/send-push";

async function createBooking(formData: FormData) {
  "use server";

  // 1. AMBIL EMAIL LANGSUNG DARI COOKIE SESI YANG AKTIF (Paling Aman)
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) {
    redirect("/login");
  }

  const tutorId = formData.get("tutorId") as string;
  const studentName = formData.get("studentName") as string;
  const subjectId = formData.get("subjectId") as string;
  const scheduleId = formData.get("scheduleId") as string;
  const method = formData.get("method") as string;
  const paymentMethod = formData.get("paymentMethod") as string;

  if (!tutorId || !studentName || !subjectId || !scheduleId || !paymentMethod) return;

  // 2. AMBIL DATA GURU UNTUK CEK STATUS COD
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
  });

  if (!tutor) return;

  if (paymentMethod === "COD_CASH" && !tutor.is_cod_enabled) {
    redirect(`/tutors/${tutorId}?error=cod_disabled`);
  }

  // 3. CARI USER BERDASARKAN EMAIL COOKIE YANG VALID
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    redirect("/login");
  }

  const schedule = await prisma.tutorSchedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) return;

  const existingBooking = await prisma.booking.findFirst({
    where: {
      schedule_id: scheduleId,
      status: {
        in: [
          "REQUESTED",
          "WAITING_ADMIN",
          "WAITING_TUTOR_CONFIRMATION",
          "TUTOR_CONFIRMED",
          "WAITING_PAYMENT",
          "PAYMENT_SUCCESS",
          "SCHEDULED",
          "ONGOING",
        ],
      },
    },
  });

  if (existingBooking) {
    redirect(`/tutors/${tutorId}`);
  }

  // 4. BUAT STUDENT PROFILE JIKA BELUM ADA, ATAU AMBIL YANG SUDAH ADA
  let studentProfile = await prisma.studentProfile.findFirst({
    where: { user_id: user.id },
  });

  if (!studentProfile) {
    studentProfile = await prisma.studentProfile.create({
      data: {
        user_id: user.id,
        name: studentName,
        level: "Umum",
        grade: "Kelas 1",
      },
    });
  } else {
    await prisma.studentProfile.update({
      where: { id: studentProfile.id },
      data: { name: studentName },
    });
  }

  const totalPrice = tutor.price_per_hour;
  const bookingCode = "TG-" + Math.floor(100000 + Math.random() * 900000);

  // 5. BUAT BOOKING DENGAN user_id YANG AKURAT MILIK SISWA YANG LOGIN
  const booking = await prisma.booking.create({
    data: {
      booking_code: bookingCode,
      user_id: user.id,
      student_profile_id: studentProfile.id,
      tutor_id: tutorId,
      subject_id: subjectId,
      schedule_id: scheduleId,
      date: new Date(),
      start_time: schedule.start_time,
      duration_minutes: 60,
      total_price: totalPrice,
      method: method === "ONLINE" ? "ONLINE" : "OFFLINE",
      payment_method: paymentMethod,
      status: "WAITING_PAYMENT",
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking.id,
      amount: totalPrice,
      status: "PENDING",
    },
  });

  // --- TRIGGER NOTIFIKASI OTOMATIS KE HP GURU ---
  try {
    if (tutor.email) {
      const tutorUser = await prisma.user.findUnique({ where: { email: tutor.email } });
      if (tutorUser) {
        await sendPushNotification(
          tutorUser.id,
          "📚 Pesanan Sesi Belajar Baru!",
          `Siswa ${studentName} baru saja memesan jadwal sesi privat dengan Anda.`,
          "/tutors/dashboard"
        );
      }
    }
  } catch (error) {
    console.error("Gagal mengirim push notification ke tutor:", error);
  }
  // --------------------------------------------

  redirect("/dashboard");
}

export default async function TutorDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const id = resolvedParams.id;
  const hasError = resolvedSearch.error === "cod_disabled";

  const tutor = await prisma.tutor.findUnique({
    where: { id },
    include: {
      subjects: { include: { subject: true } },
      schedules: true,
    },
  });

  if (!tutor) {
    return <div className="p-8 font-sans">Guru tidak ditemukan.</div>;
  }

  const isCodActive = tutor.is_cod_enabled;

  const activeBookings = await prisma.booking.findMany({
    where: {
      tutor_id: id,
      schedule_id: { not: null },
      status: {
        in: [
          "REQUESTED",
          "WAITING_ADMIN",
          "WAITING_TUTOR_CONFIRMATION",
          "TUTOR_CONFIRMED",
          "WAITING_PAYMENT",
          "PAYMENT_SUCCESS",
          "SCHEDULED",
          "ONGOING",
        ],
      },
    },
    select: {
      schedule_id: true,
    },
  });

  const bookedScheduleIds = activeBookings.map((b) => b.schedule_id);
  const availableSchedules = tutor.schedules.filter(
    (sch) => !bookedScheduleIds.includes(sch.id)
  );

  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value || "";

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative pb-20">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xs">
        <Link href="/" className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Logo Temuguru" 
            className="h-10 md:h-12 w-auto object-contain" 
          />
        </Link>
        <Link href="/dashboard" className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs">
          Dashboard Saya
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 relative z-10">
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-28 h-36 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                {tutor.photo_url ? (
                  <img src={tutor.photo_url} alt={tutor.name} className="w-full h-full object-cover" />
                ) : (
                  tutor.name.charAt(0)
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{tutor.name}</h1>
                <p className="text-xs text-slate-500 font-medium">{tutor.location} • {tutor.education}</p>
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-black px-3.5 py-1.5 rounded-full border border-blue-100 tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" /> {tutor.experience_years} Tahun Pengalaman
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1.5">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Tentang Pengajar</h2>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">{tutor.bio || "Belum ada keterangan bio."}</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 space-y-4">
            <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Mata Pelajaran yang Diajar
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {tutor.subjects.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium italic">Belum ada mata pelajaran.</p>
              ) : (
                tutor.subjects.map((ts) => (
                  <span key={ts.subject_id} className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-xs font-bold shadow-2xs">
                    {ts.subject.name} <span className="text-slate-400 font-normal">({ts.level})</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 space-y-6 h-fit sticky top-24">
          <div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Pesan Sesi</span>
              <span className="text-xl font-black text-blue-600">
                Rp {tutor.price_per_hour.toLocaleString("id-ID")} <span className="text-xs font-medium text-slate-500">/ Pertemuan</span>
              </span>
            </div>
          </div>

          {hasError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>Maaf, metode pembayaran COD sedang dinonaktifkan untuk pengajar ini. Silakan pilih metode lain.</span>
            </div>
          )}

          <form action={createBooking} className="space-y-4">
            <input type="hidden" name="tutorId" value={tutor.id} />

            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Nama Siswa / Anak</label>
              <input 
                type="text" 
                name="studentName" 
                placeholder="Contoh: Budi Junior" 
                required 
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800" 
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Email Akun (Login)</label>
              <input 
                type="email" 
                value={userEmail} 
                disabled 
                className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-500 font-medium outline-none cursor-not-allowed select-none" 
              />
            </div>

            {/* KEMBALIKAN PILIHAN MATA PELAJARAN */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Pilih Mata Pelajaran</label>
              <select name="subjectId" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer">
                <option value="">-- Pilih Mapel --</option>
                {tutor.subjects.map((ts) => (
                  <option key={ts.subject_id} value={ts.subject_id}>
                    {ts.subject.name} ({ts.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Pilih Jadwal</label>
              <select name="scheduleId" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer">
                <option value="">-- Pilih Jadwal Tersedia --</option>
                {availableSchedules.length === 0 ? (
                  <option value="" disabled>Semua jadwal sudah penuh</option>
                ) : (
                  availableSchedules.map((sch) => {
                    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                    return (
                      <option key={sch.id} value={sch.id}>
                        {days[sch.day_of_week]} | {sch.start_time} - {sch.end_time}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Metode Belajar</label>
              <select name="method" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer">
                <option value="OFFLINE">Tatap Muka / Offline</option>
                <option value="ONLINE">Online (Video Call)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">Metode Pembayaran</label>
              <select name="paymentMethod" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer">
                <option value="">-- Pilih Cara Bayar --</option>
                <option value="TRANSFER_BANK">Transfer Bank (BCA / Mandiri)</option>
                <option value="QRIS">QRIS (Scan & Pay)</option>
                
                {isCodActive && (
                  <option value="COD_CASH">Bayar Tunai / COD (Langsung ke Guru)</option>
                )}
              </select>
              {!isCodActive && (
                <p className="text-[11px] text-amber-600 mt-1.5 font-bold">Metode pembayaran COD sedang dinonaktifkan untuk pengajar ini.</p>
              )}
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 mt-2">
              Pesan Sesi Sekarang <CheckCircle className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href={`https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20booking%20pengajar%20${encodeURIComponent(tutor.name)}.`} 
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