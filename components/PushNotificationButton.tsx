"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

export default function PushNotificationButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  // Daftarkan Service Worker saat komponen dimuat
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker berhasil didaftarkan:", reg.scope))
        .catch((err) => console.error("Gagal mendaftarkan Service Worker:", err));
    }
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const handleSubscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Browser Anda tidak mendukung Push Notification.");
      return;
    }

    try {
      setLoading(true);
      
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Izin notifikasi ditolak. Anda dapat mengaktifkannya melalui pengaturan browser.");
        setLoading(false);
        return;
      }

      // Tunggu hingga Service Worker benar-benar siap
      const registration = await navigator.serviceWorker.ready;
      
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        alert("VAPID Public Key belum dikonfigurasi di file .env.");
        setLoading(false);
        return;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      const response = await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, subscription }),
      });

      if (response.ok) {
        alert("Berhasil! Notifikasi bar atas HP telah diaktifkan.");
      } else {
        alert("Gagal menyimpan langganan ke server.");
      }
    } catch (error) {
      console.error("Gagal mengaktifkan notifikasi:", error);
      alert("Terjadi kesalahan saat mengaktifkan notifikasi. Cek console browser untuk detail.");
    } finally {
      setLoading(false); // Pastikan loading selalu berhenti meskipun ada error
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="flex-1 sm:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
    >
      <Bell className="w-3.5 h-3.5" /> {loading ? "Memproses..." : "Aktifkan Notifikasi HP"}
    </button>
  );
}