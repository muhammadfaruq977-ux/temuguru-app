"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function registerTutor(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone_wa = formData.get("phone_wa") as string;
  const education = formData.get("education") as string;
  const experience_years = Number(formData.get("experience_years"));
  const price_per_hour = Number(formData.get("price_per_hour"));
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;

  // Simpan data calon guru ke database, dengan status verified = false
  await prisma.tutor.create({
    data: {
      name,
      email,
      phone_wa,
      education,
      experience_years,
      price_per_hour,
      location,
      bio,
      is_verified: false,  // Harus disetujui admin dulu
      is_active: true,
      is_cod_enabled: false, // Wajib transfer deposit dulu untuk COD
      methods: "BOTH" 
    }
  });

  // Arahkan ke halaman sukses pendaftaran
  redirect("/join/success");
}