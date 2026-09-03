"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedAdminPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memverifikasi akses...</div>;
  return <>{children}</>;
}