// @ts-nocheck
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Konfigurasi web-push dengan kunci VAPID dari .env
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@temuguru.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

export async function sendPushNotification(userId: string, title: string, body: string, url: string = "/") {
  try {
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