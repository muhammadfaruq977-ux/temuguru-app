import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const bookingId = formData.get("bookingId") as string;
    const file = formData.get("paymentProof") as File;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID tidak ditemukan" }, { status: 400 });
    }

    let filePath = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.error("Gagal membuat folder uploads:", err);
      }

      const filename = `proof-${bookingId}-${Date.now()}${path.extname(file.name)}`;
      filePath = `/uploads/${filename}`;
      
      const savePath = path.join(uploadDir, filename);
      await writeFile(savePath, buffer);
    }

    // Update database (menggunakan kolom location_notes yang sudah ada)
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: "PAYMENT_SUCCESS",
        location_notes: filePath, // Simpan path foto di location_notes
      },
    });

    await prisma.payment.updateMany({
      where: { booking_id: bookingId },
      data: { 
        status: "PAID",
      },
    });

    return NextResponse.redirect(new URL("/dashboard", request.url), 303);
  } catch (error: any) {
    console.error("Error detail saat upload pembayaran:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal server" }, { status: 500 });
  }
}