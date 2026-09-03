"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  const tutorId = formData.get("tutor_id") as string;
  const price = Number(formData.get("price"));
  const studentName = formData.get("student_name") as string;
  const studentEmail = formData.get("student_email") as string;
  const scheduleId = formData.get("schedule_id") as string;
  const subjectId = formData.get("subject_id") as string;
  const method = formData.get("method") as string;

  if (!studentName || !studentEmail || !scheduleId || !subjectId || !tutorId || !method) {
    throw new Error("Data tidak lengkap!");
  }

  // 1. Ambil detail jadwal untuk mendapatkan waktu mulai dan selesai
  const selectedSchedule = await prisma.tutorSchedule.findUnique({
    where: { id: scheduleId }
  });

  if (!selectedSchedule) throw new Error("Jadwal tidak ditemukan!");

  const [startHour, startMin] = selectedSchedule.start_time.split(':').map(Number);
  const [endHour, endMin] = selectedSchedule.end_time.split(':').map(Number);
  const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
  const bookingCode = `TRX-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

  // 2. Cari atau Buat Akun User (Karena sistem publik, kita buatkan akun tamu otomatis)
  let user = await prisma.user.findUnique({ where: { email: studentEmail } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: studentEmail,
        name: studentName,
        password_hash: "GUEST_ACCOUNT_NO_PASSWORD", // Wajib diisi sesuai skema User Anda
        role: "STUDENT"
      }
    });
  }

  // 3. Cari atau Buat Profil Siswa (StudentProfile)
  let studentProfile = await prisma.studentProfile.findFirst({
    where: { user_id: user.id }
  });

  if (!studentProfile) {
    studentProfile = await prisma.studentProfile.create({
      data: {
        user_id: user.id,
        name: studentName,
        level: "Umum", // Wajib diisi sesuai skema StudentProfile
        grade: "Umum", // Wajib diisi sesuai skema StudentProfile
      }
    });
  }

  // 4. Buat Transaksi Pemesanan (Booking)
  await prisma.booking.create({
    data: {
      booking_code: bookingCode,
      date: new Date(),
      start_time: selectedSchedule.start_time,
      duration_minutes: durationMinutes,
      total_price: price,
      method: method as any, // "ONLINE", "OFFLINE", atau "BOTH"
      
      // Relasi menggunakan ID langsung (lebih aman dan bersih)
      user_id: user.id,
      student_profile_id: studentProfile.id,
      tutor_id: tutorId,
      subject_id: subjectId,
    }
  });

  // 5. Kunci jadwal agar tidak bisa dipesan orang lain
  await prisma.tutorSchedule.update({
    where: { id: scheduleId },
    data: { is_available: false }
  });

revalidatePath(`/tutors/${tutorId}`);
  redirect(`/success?code=${bookingCode}`); // Arahkan ke halaman sukses
}