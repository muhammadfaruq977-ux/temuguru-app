import Link from "next/link";
import { CheckCircle, Clock, Smartphone } from "lucide-react";

export default function JoinSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100 text-center pt-12 pb-8 px-8">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100 relative">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">Pendaftaran Diterima!</h1>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Terima kasih telah mendaftar. Data profil Anda telah masuk ke sistem kami dan sedang dalam status <span className="font-bold text-amber-600">Menunggu Verifikasi</span>.
        </p>

        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-8 flex flex-col items-center">
          <Smartphone className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-bold text-blue-900 text-sm mb-1">Langkah Selanjutnya</h3>
          <p className="text-xs text-blue-700/80 leading-relaxed">
            Tim Admin kami akan meninjau profil Anda dan menghubungi Anda via WhatsApp dalam waktu maksimal 1x24 jam untuk proses wawancara singkat.
          </p>
        </div>

        <Link 
          href="/" 
          className="w-full block bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3.5 rounded-xl transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}