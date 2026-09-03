import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Server, UserCheck, FileText, MessageCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Perlindungan Data & Privasi
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Kebijakan Privasi
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Terakhir diperbarui: Maret 2026
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            
            {/* INTRO */}
            <p className="font-medium text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-200/60 leading-relaxed">
              Di <span className="font-bold text-slate-900">Temuguru</span>, kami sangat menghargai dan melindungi privasi serta keamanan data pribadi seluruh pengguna, baik siswa, orang tua, maupun mitra pengajar (*tutor*). Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda.
            </p>

            {/* POIN 1 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs border border-blue-100 shrink-0">1</div>
                Informasi yang Kami Kumpulkan
              </h3>
              <p>Kami mengumpulkan beberapa jenis informasi guna menyediakan dan meningkatkan layanan les privat:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Informasi Akun:</strong> Nama lengkap, alamat email, nomor telepon/WhatsApp, dan kata sandi (*password*) saat Anda mendaftar.</li>
                <li><strong>Informasi Verifikasi Pengajar (Khusus Tutor):</strong> Salinan Kartu Tanda Penduduk (KTP), ijazah pendidikan terakhir, foto profil resmi, nomor rekening bank, serta riwayat pengalaman mengajar yang diperlukan untuk proses kurasi dan verifikasi keamanan.</li>
                <li><strong>Informasi Alamat & Lokasi:</strong> Domisili atau area mengajar untuk mencocokkan kebutuhan les privat tatap muka langsung ke rumah.</li>
                <li><strong>Informasi Transaksi:</strong> Riwayat pemesanan (*booking*), status pembayaran, dan nominal saldo/*top-up* untuk keperluan fitur COD dan pencairan dana.</li>
              </ul>
            </div>

            {/* POIN 2 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs border border-indigo-100 shrink-0">2</div>
                Cara Kami Menggunakan Informasi Anda
              </h3>
              <p>Data yang Anda berikan akan digunakan untuk keperluan operasional platform, antara lain:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Verifikasi & Keamanan:</strong> Memastikan keabsahan identitas pengajar demi keamanan mutlak siswa dan orang tua.</li>
                <li><strong>Sistem Pencocokan (*Matching*):</strong> Membantu siswa menemukan guru privat terdekat dengan mata pelajaran dan kriteria yang diinginkan.</li>
                <li><strong>Keperluan Transaksi:</strong> Memproses pembayaran, pencairan honorarium, dan manajemen saldo/komisi platform secara transparan.</li>
                <li><strong>Komunikasi:</strong> Mengirimkan notifikasi penting terkait jadwal les, status verifikasi akun, pembaruan sistem, atau layanan bantuan (*customer support*).</li>
              </ul>
            </div>

            {/* POIN 3 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs border border-emerald-100 shrink-0">3</div>
                Keamanan & Penyimpanan Data
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Enkripsi & Server Aman:</strong> Kami menggunakan sistem basis data terenkripsi (melalui penyedia layanan cloud dan infrastruktur modern seperti Supabase dan Prisma) untuk mencegah akses, modifikasi, atau pengungkapan data secara tidak sah.</li>
                <li><strong>Pembatasan Akses:</strong> Akses terhadap data pribadi sensitif (seperti dokumen KTP dan ijazah) dibatasi secara ketat hanya untuk tim admin internal yang berwenang.</li>
              </ul>
            </div>

            {/* POIN 4 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xs border border-amber-100 shrink-0">4</div>
                Pengungkapan Informasi kepada Pihak Ketiga
              </h3>
              <p>Kami <strong>tidak akan pernah memperjualbelikan</strong> data pribadi Anda kepada pihak luar. Informasi Anda hanya dibagikan dalam kondisi berikut:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Mitra Layanan Pembayaran:</strong> Berkomunikasi dengan sistem perbankan atau *payment gateway* sah untuk memproses transaksi yang Anda lakukan.</li>
                <li><strong>Kewajiban Hukum:</strong> Jika diwajibkan oleh undang-undang atau perintah Pengadilan yang sah untuk melindungi hak, properti, atau keselamatan Temuguru dan penggunanya.</li>
              </ul>
            </div>

            {/* POIN 5 */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xs border border-purple-100 shrink-0">5</div>
                Hak Pengguna atas Data Pribadi
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Akses & Pembaruan:</strong> Anda berhak untuk mengakses, memperbarui, atau memperbaiki informasi profil Anda langsung melalui halaman *Dashboard* akun Anda.</li>
                <li><strong>Penghapusan Akun:</strong> Anda dapat mengajukan permohonan penutupan akun dan penghapusan data pribadi dengan menghubungi tim admin Temuguru melalui kontak resmi yang tersedia.</li>
              </ul>
            </div>

            {/* POIN 6 & 7 (HUBUNGI KAMI) */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-base font-black text-slate-900">6. Hubungi Kami</h3>
              <p>Jika Anda memiliki pertanyaan, kritik, atau permintaan terkait Kebijakan Privasi ini, silakan hubungi tim dukungan kami:</p>
              
              <div className="pt-2">
                <a 
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20Temuguru,%20saya%20ingin%20bertanya%20mengenai%20Kebijakan%20Privasi." 
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