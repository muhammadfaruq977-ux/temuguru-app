"use client";

import { useState } from "react";
import { registerTutor } from "./actions";
import { CheckCircle, ShieldCheck, Wallet, Clock, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

// Tombol Submit dengan efek Loading
function SubmitButton({ accepted }: { accepted: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={!accepted || pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-sm shadow-blue-200"
    >
      {pending ? "Mengirim Data..." : "Kirim Pendaftaran"}
    </button>
  );
}

export default function JoinPage() {
  const [showSOP, setShowSOP] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* Top Bar Minimalis */}
      <div className="bg-white px-5 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 container mx-auto max-w-6xl">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-xl text-blue-600 tracking-tight">PasuEdu Mitra</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* KOLOM KIRI: Marketing (Nilai Jual) */}
          <div className="space-y-8 sticky top-24">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4">Peluang Karir</span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                Bantu Siswa Berprestasi, <span className="text-blue-600">Dapatkan Penghasilan Tambahan.</span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                Bergabunglah dengan ratusan pengajar ahli lainnya. Atur jadwal Anda sendiri, raih pendapatan fleksibel, dan nikmati sistem yang 100% aman terproteksi.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-green-100">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Sistem Escrow Terjamin</h3>
                  <p className="text-slate-600 text-sm mt-1">Mengajar dengan tenang. Dana siswa diamankan oleh platform dan pasti cair setelah kelas selesai.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Jadwal Sangat Fleksibel</h3>
                  <p className="text-slate-600 text-sm mt-1">Anda bebas menentukan hari, jam tayang, dan metode (Online/Offline) sesuai kesibukan Anda.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-100">
                  <Wallet className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Dukungan Fitur COD</h3>
                  <p className="text-slate-600 text-sm mt-1">Tingkatkan jumlah murid dengan mengaktifkan pembayaran tunai melalui sistem deposit mitra.</p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Form Pendaftaran */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 relative">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Form Pendaftaran Guru</h2>
            
            <form action={registerTutor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Lengkap Sesuai KTP</label>
                <input name="name" required placeholder="Cth: Budi Santoso, S.Pd" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Aktif</label>
                  <input name="email" type="email" required placeholder="email@anda.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp</label>
                  <input name="phone_wa" required placeholder="08123456789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Pendidikan Terakhir</label>
                  <select name="education" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer">
                    <option value="">Pilih Jenjang...</option>
                    <option value="Mahasiswa Aktif">Mahasiswa Aktif</option>
                    <option value="D3/Diploma">D3 / Diploma</option>
                    <option value="S1/Sarjana">S1 / Sarjana</option>
                    <option value="S2/Magister">S2 / Magister</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Pengalaman (Tahun)</label>
                  <input name="experience_years" type="number" min="0" required placeholder="Cth: 2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Area Mengajar / Domisili</label>
                  <input name="location" required placeholder="Cth: Denpasar Selatan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Ekspektasi Tarif per Jam (Rp)</label>
                  <input name="price_per_hour" type="number" min="10000" step="5000" required placeholder="Cth: 50000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Biodata Singkat</label>
                <textarea name="bio" required rows={3} placeholder="Ceritakan gaya mengajar dan spesialisasi Anda secara singkat..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"></textarea>
              </div>

              {/* Kotak Persetujuan SOP (Krusial) */}
              <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="sop-check" 
                  className="mt-1 w-4 h-4 cursor-pointer accent-blue-600"
                  checked={isAccepted}
                  onChange={(e) => setIsAccepted(e.target.checked)}
                />
                <label htmlFor="sop-check" className="text-sm text-slate-700 leading-relaxed cursor-pointer select-none">
                  Saya telah membaca, memahami, dan menyetujui seluruh aturan dalam <span onClick={(e) => { e.preventDefault(); setShowSOP(true); }} className="text-blue-600 font-bold hover:underline cursor-pointer">Standar Operasional (SOP) & Syarat Ketentuan Mitra Guru</span>.
                </label>
              </div>

              <SubmitButton accepted={isAccepted} />
            </form>
          </div>
        </div>
      </div>

      {/* POP-UP MODAL SOP */}
      {showSOP && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> SOP & Aturan Kemitraan
              </h2>
              <button onClick={() => setShowSOP(false)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-600 space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">1. Sistem Komisi & Pembayaran</h3>
                <p>Platform mengenakan komisi sebesar 20% dari total nilai transaksi. Dana dari pesanan reguler (Escrow) akan dicairkan ke rekening guru 1x24 jam setelah siswa menekan tombol konfirmasi "Kelas Selesai".</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">2. Fitur Pembayaran Tunai (COD)</h3>
                <p>Fitur COD bersifat opsional. Untuk mencegah kerugian dan mempermudah pemotongan komisi platform, guru yang ingin mengaktifkan opsi COD wajib menempatkan <strong className="text-slate-900">Dana Deposit Jaminan minimal Rp 50.000</strong> ke rekening Admin. Saldo ini akan dipotong otomatis sebagai pembayaran komisi setiap kali ada siswa yang membayar tunai kepada Anda.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">3. Standar Etika & Kualitas Mengajar</h3>
                <p>Guru wajib hadir tepat waktu (atau memberikan tautan pertemuan minimal 15 menit sebelum kelas online dimulai). Pembatalan sepihak tanpa alasan mendesak dalam kurun waktu kurang dari 6 jam akan berakibat pada pembekuan akun.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">4. Penalti *Bypass* Platform</h3>
                <p>Mitra guru dilarang keras mengalihkan transaksi siswa yang didapat dari platform ini menjadi transaksi pribadi di luar sistem. Pelanggaran terhadap aturan ini mengakibatkan akun diblokir permanen dan pencabutan sisa saldo jaminan.</p>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => { setIsAccepted(true); setShowSOP(false); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm">
                Saya Mengerti & Setuju
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}