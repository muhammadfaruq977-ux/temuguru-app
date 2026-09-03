"use client";

import { useState } from "react";
import { ShieldCheck, X, CheckCircle2, AlertCircle } from "lucide-react";

interface TutorTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export default function TutorTermsModal({ isOpen, onClose, onAgree }: TutorTermsModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER MODAL */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Syarat & Ketentuan Lengkap Pengajar</h3>
              <p className="text-xs text-slate-500">Ketentuan Kemitraan, Etika Mengajar, Saldo, & Fitur COD Temuguru</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ISI KONTEN (SCROLLABLE) */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-blue-900">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Dengan mendaftar dan menggunakan platform Temuguru sebagai Pengajar (Tutor), Anda menyatakan telah membaca, memahami, dan menyetujui seluruh klausul di bawah ini.
            </p>
          </div>

          {/* BAGIAN 1: PENDAFTARAN & VERIFIKASI */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm border-b pb-1.5">1. Pendaftaran & Verifikasi Dokumen</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Keabsahan Dokumen:</strong> Calon pengajar wajib melampirkan identitas resmi (KTP) dan ijazah pendidikan terakhir yang sah.</li>
              <li><strong>Kurasi Admin:</strong> Akun baru akan melalui proses verifikasi berlapis oleh tim Temuguru sebelum diaktifkan untuk menerima penawaran mengajar.</li>
              <li><strong>Tanggung Jawab Data:</strong> Pengajar bertanggung jawab penuh atas keakuratan data profil, keahlian mata pelajaran, dan riwayat pengalaman.</li>
            </ul>
          </div>

          {/* BAGIAN 2: ETIKA & PROFESIONALISME */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm border-b pb-1.5">2. Standar Profesionalisme & Etika Mengajar</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Komitmen Kualitas:</strong> Memberikan bimbingan dengan sabar, profesional, dan berorientasi pada pemahaman konsep akademik siswa.</li>
              <li><strong>Ketepatan Waktu:</strong> Wajib hadir tepat waktu sesuai jadwal yang disepakati, baik untuk les tatap muka di rumah maupun metode lainnya.</li>
              <li><strong>Etika Sosial:</strong> Menjaga norma kesopanan, berpakaian rapi, serta menghormati aturan di lingkungan kediaman siswa.</li>
            </ul>
          </div>

          {/* BAGIAN 3: SISTEM PEMBAYARAN & DANA AMAN */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm border-b pb-1.5">3. Sistem Pembayaran & Pencairan Dana</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Jaminan Dana:</strong> Pembayaran dari siswa dikelola secara transparan oleh sistem Temuguru dan dicairkan setelah sesi belajar selesai dikonfirmasi tuntas.</li>
              <li><strong>Potongan Komisi:</strong> Setiap honorarium / transaksi dikenakan potongan administrasi atau komisi platform sesuai kesepakatan yang berlaku.</li>
            </ul>
          </div>

          {/* BAGIAN 4: TOP-UP SALDO & FITUR COD */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm border-b pb-1.5">4. Ketentuan Top-up Saldo & Aktivasi Fitur COD</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Fungsi Saldo / Deposit:</strong> Saldo pengajar digunakan sebagai jaminan operasional dan potongan komisi otomatis untuk transaksi tunai (Cash on Delivery).</li>
              <li><strong>Prosedur Top-up:</strong> Pengajar wajib melakukan transfer sesuai nominal minimum, mengunggah bukti sah, dan menunggu verifikasi admin (maksimal 1x24 jam).</li>
              <li><strong>Batas Minimum:</strong> Jika saldo berada di bawah batas ketentuan, fitur COD akan dinonaktifkan otomatis oleh sistem hingga dilakukan top-up kembali.</li>
            </ul>
          </div>

          {/* BAGIAN 5: SANKSI & PENUTUPAN AKUN */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm border-b pb-1.5">5. Integritas, Pembatalan, & Sanksi</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Larangan Transaksi Gelap:</strong> Pengajar dilarang keras memanipulasi data sesi atau bertransaksi di luar sistem untuk menghindari komisi platform.</li>
              <li><strong>Sanksi Pelanggaran:</strong> Pelanggaran berat, pemalsuan dokumen, atau laporan kecurangan COD akan berakibat pada pembekuan saldo dan penangguhan akun permanen.</li>
            </ul>
          </div>

        </div>

        {/* FOOTER & PERSETUJUAN */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
          
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700">
              Saya menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan Pengajar di atas.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
            >
              Tutup
            </button>
            <button 
              disabled={!isChecked}
              onClick={() => {
                onAgree();
                onClose();
              }}
              className={`px-6 py-3 rounded-xl text-xs font-bold text-white transition shadow-md flex items-center gap-2 ${
                isChecked 
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200 cursor-pointer" 
                  : "bg-slate-300 cursor-not-allowed shadow-none"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Setuju & Lanjutkan
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}