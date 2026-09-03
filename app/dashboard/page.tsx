// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Calendar, BookOpen, Clock, LogOut, CheckCircle, Settings, FileText, AlertCircle, CreditCard, QrCode, ArrowRight, Star } from "lucide-react";
import PushNotificationButton from "@/components/PushNotificationButton";
import SidebarMenu from "@/components/SidebarMenu";

// IMPORT FUNGSI PENGIRIM NOTIFIKASI
import { sendPushNotification } from "@/lib/send-push";

// WAJIB IMPORT INI UNTUK MENYIMPAN FILE KE SERVER
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

async function handleLogout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("user_email");
  redirect("/login");
}

// FUNGSI UPLOAD BUKTI PEMBAYARAN
async function uploadProof(formData: FormData) {
  "use server";
  const bookingId = formData.get("bookingId") as string;
  const file = formData.get("proofImage") as File; 
  
  if (!bookingId || !file || file.size === 0) return;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public/uploads");

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const extension = file.name.split(".").pop();
  const fileName = `bukti-${uniqueSuffix}.${extension}`;
  
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/${fileName}`;
  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      location_notes: fileUrl,
      status: "WAITING_ADMIN" 
    },
  });

  // --- TRIGGER NOTIFIKASI KE ADMIN ---
  try {
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    for (const admin of admins) {
      await sendPushNotification(
        admin.id,
        "💳 Pembayaran Baru Masuk!",
        "Siswa telah mengunggah bukti pembayaran. Segera verifikasi pesanan ini.",
        "/admin/bookings"
      );
    }
  } catch (error) {
    console.error("Gagal kirim notif ke admin:", error);
  }
  // -----------------------------------

  revalidatePath("/dashboard");
  revalidatePath("/admin/bookings");
  redirect("/dashboard");
}

// FUNGSI SISTEM ESCROW: SESI SELESAI & LEPAS DANA KE GURU
async function completeSessionAndReleaseEscrow(formData: FormData) {
  "use server";
  const bookingId = formData.get("bookingId") as string;

  if (!bookingId) return;

  // 1. Ubah status booking menjadi COMPLETED
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  // 2. Ubah status pembayaran escrow menjadi RELEASED (dana diteruskan ke guru)
  await prisma.payment.updateMany({
    where: { booking_id: bookingId },
    data: { status: "PAID" },
  });

  // --- TRIGGER NOTIFIKASI KE TUTOR & ADMIN ---
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tutor: true }
    });
    
    // Notif ke Tutor
    if (booking && booking.tutor && booking.tutor.email) {
      const tutorUser = await prisma.user.findUnique({ where: { email: booking.tutor.email } });
      if (tutorUser) {
        await sendPushNotification(
          tutorUser.id,
          "🎉 Sesi Telah Selesai!",
          "Siswa telah menyelesaikan sesi. Dana Anda sedang diproses oleh sistem.",
          "/tutors/dashboard"
        );
      }
    }

    // Notif ke Admin
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    for (const admin of admins) {
      await sendPushNotification(
        admin.id,
        "💰 Pencairan Dana (Payout) Baru",
        "Sebuah sesi telah selesai. Silakan cairkan dana (Escrow) ke rekening pengajar terkait.",
        "/admin/bookings"
      );
    }
  } catch (error) {
    console.error("Gagal kirim notif escrow:", error);
  }
  // -------------------------------------------

  revalidatePath("/dashboard");
  revalidatePath("/tutors/dashboard");
  redirect("/dashboard");
}

// FUNGSI KIRIM REVIEW / ULASAN SISWA
async function submitReview(formData: FormData) {
  "use server";
  const booking_id = formData.get("booking_id") as string;
  const tutor_id = formData.get("tutor_id") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  if (!booking_id || !tutor_id || !rating) return;

  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) return;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) return;

  try {
    await prisma.review.create({
      data: {
        booking_id,
        user_id: user.id,
        tutor_id,
        rating,
        comment: comment || "",
      },
    });

    // --- TRIGGER NOTIFIKASI KE TUTOR ---
    const tutor = await prisma.tutor.findUnique({ where: { id: tutor_id } });
    if (tutor && tutor.email) {
      const tutorUser = await prisma.user.findUnique({ where: { email: tutor.email } });
      if (tutorUser) {
        await sendPushNotification(
          tutorUser.id,
          "⭐ Anda Mendapat Ulasan Baru!",
          `Siswa memberikan ulasan ${rating} Bintang untuk sesi Anda.`,
          "/tutors/dashboard"
        );
      }
    }
    // -----------------------------------

  } catch (error) {
    console.error("Gagal menyimpan ulasan:", error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/"); // Memperbarui landing page agar menampilkan ulasan terbaru
  redirect("/dashboard");
}

export default async function StudentDashboardPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      bookings: {
        include: { tutor: true, subject: true, review: true },
        orderBy: { created_at: "desc" },
      },
      profiles: true,
    },
  });

  if (!user || user.role !== "STUDENT") redirect("/login");

  // Hitung pesanan yang memerlukan tindakan pembayaran (WAITING_PAYMENT)
  const pendingPaymentCount = user.bookings.filter(
    (b) => b.status === "WAITING_PAYMENT"
  ).length;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative pb-20">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      {/* NAVBAR / HEADER UTAMA DENGAN GARIS TIGA (SIDEBAR MENU) */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg overflow-hidden border border-blue-100 shrink-0 shadow-2xs">
              {user.image_url ? (
                <img src={user.image_url} alt="Foto Profil" className="w-full h-full object-cover" />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : "S"
              )}
            </div>
            <div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                Siswa / Orang Tua
              </span>
              <h1 className="text-base font-black text-slate-900 mt-0.5">Halo, {user.name || "Siswa"}! 👋</h1>
            </div>
          </div>

          {/* IKON GARIS TIGA (HAMBURGER MENU TIRAI) */}
          <div>
            <SidebarMenu>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Menu Utama</div>
              
              {/* TOMBOL AKTIFKAN NOTIFIKASI HP */}
              <div className="w-full">
                <PushNotificationButton userId={user.id} />
              </div>

              <Link href="/dashboard/profile" className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold p-3.5 rounded-2xl transition-all border border-slate-200 flex items-center justify-between shadow-2xs cursor-pointer">
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-500" /> Kelola Profil
                </span>
                {pendingPaymentCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">
                    {pendingPaymentCount} Tagihan
                  </span>
                )}
              </Link>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <form action={handleLogout} className="w-full">
                  <button type="submit" className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold p-3.5 rounded-2xl transition-all border border-red-100 flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </form>
              </div>
            </SidebarMenu>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-6 relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Riwayat & Jadwal Sesi Privat Saya</h2>
            <p className="text-xs text-slate-500 font-medium">Pantau status pesanan, lakukan pembayaran, dan selesaikan sesi les di sini.</p>
          </div>
          <Link href="/tutors" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center gap-1.5 shrink-0 hover:-translate-y-0.5 cursor-pointer">
            Cari Guru Baru <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {user.bookings.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-12 text-center space-y-4 shadow-xl shadow-blue-900/5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-base">Belum ada sesi dipesan</h3>
              <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">Mulai perjalanan belajar Anda dengan mencari pengajar privat profesional.</p>
            </div>
            <Link href="/tutors" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all cursor-pointer hover:-translate-y-0.5">
              Cari Pengajar Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {user.bookings.map((booking) => {
              const hasProofImage = booking.location_notes && booking.location_notes.startsWith("/uploads/");
              const isSessionActive = booking.status === "SCHEDULED" || booking.status === "PAYMENT_SUCCESS" || booking.status === "TUTOR_CONFIRMED";

              return (
                <div key={booking.id} className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 space-y-6">
                  
                  {/* Bagian Atas Kartu: Info Guru & Harga */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                          Kode: {booking.booking_code}
                        </span>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-wider ${
                          booking.status === "WAITING_PAYMENT" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                          booking.status === "WAITING_ADMIN" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          booking.status === "COMPLETED" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          Status: {booking.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="font-black text-xl text-slate-900">{booking.tutor?.name}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" /> <span className="font-bold text-slate-800">{booking.subject?.name}</span>
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-blue-600" /> <span className="font-bold text-slate-800">{booking.start_time} WIB</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl border border-slate-200/80 md:border-0 shadow-2xs md:shadow-none">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Biaya Sesi</p>
                      <p className="text-xl font-black text-blue-600 my-0.5">Rp {booking.total_price.toLocaleString("id-ID")}</p>
                      <span className="inline-block text-[10px] font-black text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-xl uppercase tracking-wider mt-1 shadow-2xs">
                        Metode: {booking.payment_method?.replace("_", " ") || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Bagian Bawah Kartu: Area Pembayaran / Upload Bukti / Escrow / Review */}
                  <div className="pt-5 border-t border-slate-100 space-y-4">
                    
                    {/* 1. JIKA STATUS MASIH MENUNGGU PEMBAYARAN */}
                    {booking.status === "WAITING_PAYMENT" && booking.payment_method !== "COD_CASH" && (
                      <div className="space-y-5 bg-slate-50/80 backdrop-blur-md border border-slate-200/80 p-6 rounded-3xl shadow-2xs">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Silakan Lakukan Pembayaran Melalui Salah Satu Opsi Berikut:</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Transfer Bank BCA</p>
                              <p className="text-sm font-black text-slate-900 tracking-wider">2320748197</p>
                              <p className="text-[11px] text-slate-600 font-bold">a.n. Adam Maulana</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Transfer Bank BRI</p>
                              <p className="text-sm font-black text-slate-900 tracking-wider">005201171670509</p>
                              <p className="text-[11px] text-slate-600 font-bold">a.n. Adam Maulana</p>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center">
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                              <QrCode className="w-4 h-4 text-blue-600" /> Scan QRIS (Semua E-Wallet)
                            </div>
                            <img 
                              src="/qris.jpg" 
                              alt="QRIS Temuguru" 
                              className="w-28 h-28 object-contain rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-2xs" 
                            />
                            <p className="text-[10px] text-slate-400 font-medium mt-2">GoPay, OVO, DANA, ShopeePay, atau m-Banking</p>
                          </div>
                        </div>

                        <form action={uploadProof} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <div className="flex-1 w-full space-y-1.5">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Upload Bukti Transfer Pembayaran</label>
                            <input 
                              type="file" 
                              name="proofImage" 
                              accept="image/*"
                              required 
                              className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-slate-50 rounded-2xl border border-slate-200" 
                            />
                          </div>
                          <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-4 rounded-2xl transition-all shrink-0 shadow-xl shadow-blue-600/20 cursor-pointer hover:-translate-y-0.5">
                            Kirim Bukti Asli
                          </button>
                        </form>
                      </div>
                    )}

                    {/* 2. JIKA BUKTI SUDAH DIUPLOAD */}
                    {hasProofImage && booking.status === "WAITING_ADMIN" && (
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-emerald-950 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Bukti Pembayaran Berhasil Terkirim
                          </p>
                          <p className="text-[11px] text-emerald-800 font-medium">Menunggu verifikasi dan konfirmasi dari Admin.</p>
                        </div>
                        <a href={booking.location_notes!} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-all flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer">
                          <FileText className="w-4 h-4 text-emerald-600" /> Cek Bukti Saya
                        </a>
                      </div>
                    )}

                    {/* 3. TOMBOL ESCROW: SESI SELESAI & LEPAS DANA */}
                    {isSessionActive && (
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/80 backdrop-blur-md border border-emerald-200 p-5 rounded-2xl shadow-2xs">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-emerald-950 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Sesi Belajar Sedang / Telah Berlangsung
                          </p>
                          <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                            Jika sesi les privat bersama pengajar sudah selesai dilakukan, klik tombol di samping untuk menyatakan selesai dan melepas dana ke pengajar.
                          </p>
                        </div>
                        <form action={completeSessionAndReleaseEscrow} className="shrink-0 w-full sm:w-auto">
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <button 
                            type="submit" 
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
                          >
                            Sesi Selesai & Lepas Dana
                          </button>
                        </form>
                      </div>
                    )}

                    {/* 4. JIKA STATUS SUDAH SELESAI (COMPLETED) & FITUR REVIEW */}
                    {booking.status === "COMPLETED" && (
                      <div className="space-y-4">
                        <div className="bg-purple-50/80 backdrop-blur-md border border-purple-200 p-4 rounded-2xl flex gap-3 items-center shadow-2xs">
                          <CheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-black text-purple-950">Sesi Telah Selesai & Dana Berhasil Dilepas</p>
                            <p className="text-[11px] text-purple-800 font-medium">Terima kasih telah menggunakan layanan Temuguru. Dana telah diteruskan ke saldo pengajar.</p>
                          </div>
                        </div>

                        {/* BAGIAN REVIEW / ULASAN */}
                        {booking.review ? (
                          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Ulasan Anda untuk Sesi Ini</span>
                              <div className="flex text-amber-400">
                                {[...Array(booking.review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 font-medium italic">"{booking.review.comment || "Tanpa komentar tambahan."}"</p>
                          </div>
                        ) : (
                          <form action={submitReview} className="bg-slate-50/90 backdrop-blur-md border border-slate-200 p-5 rounded-2xl space-y-4 shadow-2xs">
                            <input type="hidden" name="booking_id" value={booking.id} />
                            <input type="hidden" name="tutor_id" value={booking.tutor_id} />

                            <div className="space-y-1">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-amber-500 fill-current" /> Berikan Ulasan & Rating Pengajar
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium">Bagikan pengalaman belajar Anda agar membantu pengajar dan pengguna lain.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Rating Bintang</label>
                                <select name="rating" required className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 text-slate-800 cursor-pointer shadow-2xs">
                                  <option value="5">⭐⭐⭐⭐⭐ (5 - Sangat Puas)</option>
                                  <option value="4">⭐⭐⭐⭐ (4 - Puas)</option>
                                  <option value="3">⭐⭐⭐ (3 - Cukup)</option>
                                  <option value="2">⭐⭐ (2 - Kurang)</option>
                                  <option value="1">⭐ (1 - Sangat Kurang)</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Komentar / Testimoni</label>
                                <input 
                                  type="text" 
                                  name="comment" 
                                  placeholder="Contoh: Pengajarnya sangat sabar dan materinya mudah dipahami!" 
                                  className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 text-slate-800 shadow-2xs" 
                                  required
                                />
                              </div>
                            </div>

                            <button 
                              type="submit" 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 cursor-pointer hover:-translate-y-0.5"
                            >
                              Kirim Ulasan Sekarang
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* 5. JIKA MEMILIH COD */}
                    {booking.payment_method === "COD_CASH" && booking.status !== "COMPLETED" && (
                      <div className="bg-amber-50/80 backdrop-blur-md border border-amber-200 p-4 rounded-2xl flex gap-3 items-start shadow-2xs">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-amber-950">Pembayaran Tunai (COD)</p>
                          <p className="text-[11px] text-amber-900 font-medium leading-relaxed">Silakan lakukan pembayaran secara langsung kepada pengajar pada saat sesi les privat berlangsung.</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) */}
      <a 
        href="https://wa.me/6281217368545?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20layanan%20les%20privat." 
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