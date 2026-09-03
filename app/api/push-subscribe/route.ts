import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, subscription } = body;

    if (!userId || !subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Data langganan tidak valid" }, { status: 400 });
    }

    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    // Simpan atau perbarui data subscription ke database
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { user_id: userId, p256dh, auth },
      create: { user_id: userId, endpoint, p256dh, auth },
    });

    return NextResponse.json({ success: true, message: "Berlangganan notifikasi berhasil!" });
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return NextResponse.json({ error: "Gagal memproses langganan" }, { status: 500 });
  }
}