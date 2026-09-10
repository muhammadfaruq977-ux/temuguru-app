"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitUploadButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-4 rounded-2xl transition-all shrink-0 shadow-xl shadow-blue-600/20 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Mengunggah...
        </>
      ) : (
        "Kirim Bukti Asli"
      )}
    </button>
  );
}