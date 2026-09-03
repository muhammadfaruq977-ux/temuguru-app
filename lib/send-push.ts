// @ts-nocheck
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Ambil kunci VAPID dari environment variables
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

// 🛑 Berikan pengaman agar tidak error/crash saat proses build jika kunci belum terbaca
if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:ma.maulana002@gmail.com",
    publicVapidKey,
    privateVapidKey
  );
}

export async function sendPushNotification(userId: string, title: string, body: string, url: string = "/") {
  try {
    // Pastikan kunci VAPID tersedia sebelum mencoba mengirim notifikasi
    if (!publicVapidKey || !privateVapidKey) {
      console.warn("VAPID keys are missing. Push notification skipped.");
      return;
    }

    // Ambil semua perangkat/browser yang terdaftar atas nama user tersebut
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { user_id: userId },
    });

    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    // Kirim notifikasi ke setiap perangkat yang terdaftar
    for (const sub of subscriptions) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (error: any) {
        // Jika token sudah kedaluwarsa atau user mencabut izin (error 410 / 404), hapus dari database
        if (error.statusCode === 410 || error.statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        } else {
          console.error("Gagal mengirim push ke perangkat:", error);
        }
      }
    }
  } catch (error) {
    console.error("Gagal menjalankan fungsi sendPushNotification:", error);
  }
}