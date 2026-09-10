"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function registerTutor(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone_wa = formData.get("phone_wa") as string;
  const education = formData.get("education") as string;
  const experience_years = Number(formData.get("experience_years"));
  const price_per_hour = Number(formData.get("price_per_hour"));
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  
  // Tangkap file foto profil dari form
  const file = formData.get("profilePhoto") as File;

  let photoUrl = "";

  // Proses upload foto ke Supabase Storage jika file valid
  if (file && typeof file !== "string" && file.size > 0) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.name ? file.name.split(".").pop() : "jpg";
      const fileName = `tutor-${uniqueSuffix}.${extension}`;

      // Menggunakan bucket 'bukti-transfer' atau bucket khusus yang Anda miliki
      const { error: uploadError } = await supabase.storage
        .from("bukti-transfer") 
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("bukti-transfer")
          .getPublicUrl(fileName);

        photoUrl = publicUrlData.publicUrl;
      }
    } catch (err) {
      console.error("Gagal mengunggah foto tutor ke Supabase:", err);
    }
  }

  // Simpan data calon guru ke database beserta URL foto publiknya
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
      photo_url: photoUrl, // Menyimpan URL foto hasil upload Supabase
      is_verified: false,  // Harus disetujui admin dulu
      is_active: true,
      is_cod_enabled: false, // Wajib transfer deposit dulu untuk COD
      methods: "BOTH" 
    }
  });

  // Arahkan ke halaman sukses pendaftaran
  redirect("/join/success");
}