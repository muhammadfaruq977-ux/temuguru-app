import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { CheckCircle, UploadCloud, Clock, Banknote, ArrowLeft } from "lucide-react";
export const dynamic = 'force-dynamic';

// Server Action untuk memproses bukti transfer
async function submitPayout(formData: FormData) {
  "use server";
  const bookingId = formData.get("booking_id") as string;
  const receiptUrl = formData.get("receipt_url") as string;

  if (!receiptUrl) return;

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      payout_status: "TRANSFERRED",
      payout_receipt: receiptUrl, 
    },
  });

  revalidatePath("/admin/payouts");
}

export default async function AdminPayoutsPage() {
  const PLATFORM_FEE_PERCENTAGE = 10;
  const TUTOR_CUT = (100 - PLATFORM_FEE_PERCENTAGE) / 100;

  // Ambil semua pesanan yang sudah COMPLETED
  const bookings = await prisma.booking.findMany({
    where: { status: "COMPLETED" },
    include: { tutor: true, student: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* TOMBOL KEMBALI KE /admin/bookings */}
        <div>
          <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Pencairan Dana Guru (Payouts)</h1>
          <p className="text-slate-500">Kelola dan unggah bukti transfer pendapatan bersih ke rekening mitra pengajar.</p>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking: any) => {
            const netIncome = Math.round(booking.total_price * TUTOR_CUT);
            const isTransferred = booking.payout_status === "TRANSFERRED";

            return (
              <div key={booking.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
                
                {/* Info Sesi & Rekening */}
                <div className="space-y-3 w-full md:w-auto">
                  <div className="flex gap-3 items-center">
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {booking.booking_code}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                      isTransferred ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {isTransferred ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isTransferred ? "SUDAH DITRANSFER" : "MENUNGGU TRANSFER"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Guru: {booking.tutor.name}</h3>
                    <p className="text-sm text-slate-500">Siswa: {booking.student.name}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100 flex gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-70">Transfer Ke Rekening:</p>
                      <p className="font-black">{booking.tutor.bank_account || "BELUM DIISI"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-70">Jumlah Bersih (90%):</p>
                      <p className="font-black text-emerald-700 flex items-center gap-1">
                        <Banknote className="w-4 h-4"/> Rp {netIncome.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Upload / Tampilan Bukti */}
                <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {isTransferred ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Bukti Terunggah</p>
                      <img src={booking.payout_receipt} alt="Bukti Transfer" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                    </div>
                  ) : (
                    <form action={submitPayout} className="space-y-3">
                      <input type="hidden" name="booking_id" value={booking.id} />
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Link URL Bukti Transfer (Imgur/Drive)</label>
                        <input 
                          type="text" 
                          name="receipt_url" 
                          required 
                          placeholder="https://..." 
                          className="w-full mt-1 text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                        <UploadCloud className="w-4 h-4" /> Tandai Sudah Ditransfer
                      </button>
                    </form>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}