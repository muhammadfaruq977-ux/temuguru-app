import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck, MessageCircle } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
      
      {/* VIBRANT GLOWING BLOBS BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-blue-400/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-10 w-[500px] h-[500px] bg-purple-400/35 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[110px] pointer-events-none z-0"></div>

      {/* NAVBAR SEDERHANA */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 md:px-12 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-xs">
        <Link href="/" className="flex items-center shrink-0">
          <img 
            src="/logo.png" 
            alt="Logo Temuguru" 
            className="h-8 md:h-12 w-auto object-contain max-h-[48px]" 
          />
        </Link>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 p-8 md:p-14 space-y-10">
          
          {/* HEADER JUDUL */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest bg-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              <FileText className="w-4 h-4 text-blue-600" /> Aturan & Ketentuan Layanan
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Syarat & Ketentuan
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Terakhir diperbarui: Maret 2026
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            
            {/* INTRO */}
            <p className="font-medium text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-200/60 leading-relaxed">
              Selamat datang di <span className="font-bold text-slate-900">Temuguru</span>. Dengan mengakses, mendaftar, atau menggunakan platform kami (baik sebagai siswa, orang tua, maupun mitra pengajar), Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini.
            </p>

            {/* POIN 1 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs border border-blue-100 shrink-0">1</div>
                Ketentuan Umum Penggunaan Platform
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Definisi:</strong> Temuguru adalah platform digital penghubung antara pencari les privat (siswa/orang tua) dengan pengajar profesional (tutor).</li>
                <li><strong>Usia & Akun:</strong> Pengguna wajib memberikan informasi yang akurat dan aktif saat membuat akun. Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi akun masing-masing.</li>
              </ul>
            </div>

            {/* POIN 2 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs border border-indigo-100 shrink-0">2</div>
                Pendaftaran & Verifikasi Pengajar (Tutor)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Keabsahan Dokumen:</strong> Calon pengajar wajib melampirkan identitas resmi (KTP) dan ijazah pendidikan terakhir yang sah serta valid.</li>
                <li><strong>Kurasi Admin:</strong> Akun pengajar baru akan melalui proses verifikasi berlapis oleh tim Temuguru sebelum diaktifkan untuk menerima penawaran bimbingan belajar.</li>
                <li><strong>Standar Etika:</strong> Pengajar wajib bersikap profesional, sabar, tepat waktu, serta menghormati norma sosial dan aturan kediaman siswa selama sesi les berlangsung.</li>
              </ul>
            </div>

            {/* POIN 3 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs border border-emerald-100 shrink-0">3</div>
                Sistem Pembayaran & Jaminan Dana Aman
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Transaksi Terpusat:</strong> Seluruh pembayaran dari siswa dikelola secara transparan oleh sistem Temuguru guna melindungi keamanan dana kedua belah pihak.</li>
                <li><strong>Pencairan Dana:</strong> Honorarium pengajar akan dicairkan setelah sesi bimbingan belajar selesai dilaksanakan dan dikonfirmasi tuntas.</li>
                <li><strong>Potongan Komisi:</strong> Setiap transaksi atau honorarium dikenakan potongan administrasi/layanan platform sesuai ketentuan yang berlaku.</li>
              </ul>
            </div>

            {/* POIN 4 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xs border border-amber-100 shrink-0">4</div>
                Ketentuan Top-up Saldo & Fitur COD (Cash on Delivery)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Fungsi Saldo / Deposit:</strong> Saldo di dalam akun pengajar berfungsi sebagai jaminan operasional dan potongan komisi otomatis untuk transaksi metode pembayaran tunai langsung (COD).</li>
                <li><strong>Batas Minimum:</strong> Pengajar wajib menjaga saldo minimum agar fitur COD tetap aktif. Jika saldo di bawah batas ketentuan, fitur COD akan dinonaktifkan otomatis oleh sistem.</li>
                <li><strong>Integritas Transaksi:</strong> Dilarang keras melakukan manipulasi data sesi atau transaksi di luar sistem untuk menghindari komisi. Pelanggaran berakibat pembekuan saldo dan penangguhan akun.</li>
              </ul>
            </div>

            {/* POIN 5 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xs border border-purple-100 shrink-0">5</div>
                Kebijakan Pembatalan & Perubahan Jadwal
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Pemberitahuan Dini:</strong> Pembatalan atau penjadwalan ulang (*reschedule*) sesi belajar wajib diinformasikan minimal 1 hari sebelum jadwal kepada pihak terkait atau admin.</li>
                <li><strong>Sanksi Pembatalan Sepihak:</strong> Pembatalan berulang tanpa alasan mendesak dapat mempengaruhi reputasi akun dan berujung pada sanksi pembatasan layanan.</li>
              </ul>
            </div>

            {/* POIN 6 & 7 (HUBUNGI KAMI) */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-base font-black text-slate-900">6. Bantuan & Pertanyaan</h3>
              <p>Jika Anda membutuhkan bantuan lebih lanjut terkait Syarat & Ketentuan ini, silakan hubungi tim dukungan resmi kami:</p>
              
              <div className="pt-2">
                <a 
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20Syarat%20dan%20Ketentuan." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white" /> Hubungi Admin via WhatsApp
                </a>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/60 py-8 text-center text-xs text-slate-500 font-medium relative z-20 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Temuguru. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}