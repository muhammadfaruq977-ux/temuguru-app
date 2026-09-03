export function getAdminWhatsAppUrl(bookingCode: string, studentName: string, subjectName: string, tutorName: string, price: number) {
  const phone = "6287856295748"; // Nomor WhatsApp Admin Anda
  const message = `Halo Admin Temuguru, konfirmasi untuk pesanan:\n\n` +
    `🔹 *Kode:* ${bookingCode}\n` +
    `👤 *Siswa:* ${studentName}\n` +
    `📚 *Mapel:* ${subjectName}\n` +
    `👨‍🏫 *Guru:* ${tutorName}\n` +
    `💰 *Total:* Rp${price.toLocaleString('id-ID')}\n\n` +
    `Mohon diproses ya!`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}