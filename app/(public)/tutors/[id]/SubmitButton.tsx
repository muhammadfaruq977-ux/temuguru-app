"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitButton() {
  // useFormStatus akan mendeteksi apakah form sedang dalam proses pengiriman ke database
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 mt-4 rounded-xl shadow-sm shadow-blue-200 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Memproses Pesanan...
        </>
      ) : (
        "Konfirmasi Pesanan"
      )}
    </button>
  );
}