import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, CheckCircle2, XCircle, ArrowLeft, FileText, ExternalLink, CheckCircle, CreditCard, Banknote } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic'; 

async function acceptBooking(formData: FormData) {
  "use server";
  const bookingId = formData.get("bookingId") as string;
  if (!bookingId) return;

  const currentBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true }
  });

  // PERBAIKAN: Cegah perubahan mundur jika status sudah selesai atau sudah dibayar
  if (currentBooking?.status === "COMPLETED" || currentBooking?.status === "PAYMENT_SUCCESS") {
    return; 
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "PAYMENT_SUCCESS" }, 
  });

  revalidatePath("/admin/bookings");
  redirect("/admin/bookings"); 
}

async function rejectBooking(formData: FormData) {
  "use server";
  const bookingId = formData.get("bookingId") as string;
  if (!bookingId) return;

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/admin/bookings");
  redirect("/admin/bookings"); 
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      tutor: true,
      subject: true,
      student: true,
      payment: true,
      user: true,
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 font-sans text-slate-800 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="space-y-1">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Admin
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
              Panel Admin Temuguru
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Pesanan & Metode Pembayaran</h1>
          <p className="text-xs text-slate-500">Periksa metode pembayaran siswa, bukti transfer, dan konfirmasi sesi les privat.</p>
        </div>

        {/* TOMBOL LINK KE HALAMAN PAYOUTS */}
        <Link 
          href="/admin/payouts"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Banknote className="w-5 h-5" />
          Panel Pencairan Guru
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">Daftar Semua Pesanan</h2>
            <p className="text-xs text-slate-400">Total pesanan masuk: {bookings.length} sesi</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-sm text-slate-700">Belum ada pesanan masuk</p>
            <p className="text-xs text-slate-400">Pesanan dari siswa akan muncul di sini secara real-time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isPaid = booking.status === "PAYMENT_SUCCESS";
              // PERBAIKAN: Masukkan status COMPLETED agar tombol Terima Sesi disembunyikan
              const isConfirmed = booking.status === "TUTOR_CONFIRMED" || isPaid || booking.status === "COMPLETED";
              const isCancelled = booking.status === "CANCELLED";
              const hasProofImage = booking.location_notes && booking.location_notes.startsWith("/uploads/");
              const isCod = booking.payment_method === "COD_CASH";

              return (
                <div 
                  key={booking.id} 
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-black px-3 py-1 rounded-xl">
                        {booking.booking_code}
                      </span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
                        booking.status === "WAITING_PAYMENT" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        booking.status === "PAYMENT_SUCCESS" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        booking.status === "TUTOR_CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        booking.status === "COMPLETED" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        booking.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {booking.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">• Metode Belajar: <strong className="text-slate-800">{booking.method}</strong></span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <p>Siswa: <strong className="text-slate-900">{booking.student.name}</strong> ({booking.user.email})</p>
                        <p>Guru Dipilih: <strong className="text-slate-900">{booking.tutor.name}</strong></p>
                      </div>
                      <div>
                        <p>Mata Pelajaran: <strong className="text-slate-900">{booking.subject.name}</strong></p>
                        <p>Jam Mulai: <strong className="text-slate-900">{booking.start_time} WIB</strong></p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <div className="text-xs text-blue-700 font-bold bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        {isCod ? <Banknote className="w-3.5 h-3.5 text-amber-600" /> : <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        <span>Metode Bayar: <strong>{booking.payment_method || "TRANSFER_BANK"}</strong></span>
                      </div>
                      <div className="text-xs text-slate-700 font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                        Total: Rp {booking.total_price.toLocaleString("id-ID")}
                      </div>

                      {hasProofImage && !isCod && (
                        <a 
                          href={booking.location_notes!} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" /> Lihat Bukti Upload <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {!isConfirmed && !isCancelled ? (
                      <>
                        <form action={acceptBooking}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Terima Sesi
                          </button>
                        </form>
                        <form action={rejectBooking}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <button type="submit" className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" /> Tolak
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className={`text-xs font-bold border px-4 py-3 rounded-2xl flex items-center gap-1.5 shadow-sm ${
                        booking.status === "COMPLETED" 
                        ? "text-purple-700 bg-purple-50 border-purple-200" 
                        : "text-emerald-700 bg-emerald-50 border-emerald-200"
                      }`}>
                        <CheckCircle className={`w-4 h-4 ${booking.status === "COMPLETED" ? "text-purple-600" : "text-emerald-600"}`} /> 
                        {booking.status === "COMPLETED" ? "Sesi Selesai" : "Sesi Dikonfirmasi"}
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
  );
}