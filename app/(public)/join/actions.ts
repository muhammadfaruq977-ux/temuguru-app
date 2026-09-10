"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function registerTutor(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const education = formData.get("education") as string;
  const location = formData.get("location") as string;
  const phone_wa = formData.get("phone_wa") as string;
  const price_per_hour = Number(formData.get("price_per_hour")) || 50000;
  const experience_years = Number(formData.get("experience_years")) || 1;
  const bio = formData.get("bio") as string;
  const bank_account = formData.get("bank_account") as string;
  const file = formData.get("profilePhoto") as File;

  if (!name || !email || !password || !education || !location || !phone_wa) {
    return redirect("/join?error=incomplete_fields");
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanPhone = phone_wa.trim();

  // Cek apakah data sudah ada di tabel Tutor atau User
  const existingTutor = await prisma.tutor.findFirst({
    where: {
      OR: [{ email: cleanEmail }, { phone_wa: cleanPhone }],
    },
  });
  
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existingTutor || existingUser) {
    return redirect("/join?error=already_exists");
  }

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tutors/login?message=Email berhasil diverifikasi! Silakan login.`,
    },
  });

  if (authError) {
    console.error("Supabase Auth Error:", authError.message);
    return redirect(`/join?error=${encodeURIComponent(authError.message)}`);
  }

  let finalPhotoUrl = null;

  // Upload foto profil ke Supabase Storage (Bypass EROFS Vercel)
  if (file && file.size > 0 && file.name !== "undefined") {
    try {
      const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.name ? file.name.split(".").pop() : "jpg";
      const fileName = `tutor-${uniqueSuffix}.${extension}`;
      const BUCKET_NAME = "tutors-photo";

      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        finalPhotoUrl = publicUrlData.publicUrl;
      } else {
        console.error("Gagal upload foto ke Supabase Storage:", uploadError.message);
      }
    } catch (error) {
      console.error("Gagal mengunggah foto profil guru:", error);
    }
  }

  // 1. Simpan ke tabel User (menggunakan kolom image_url)
  await prisma.user.create({
    data: {
      name,
      email: cleanEmail,
      password_hash: "SUPABASE_AUTH", // Password ditangani aman oleh Supabase
      phone: cleanPhone,
      address: location,
      role: "TUTOR",
      image_url: finalPhotoUrl,
    },
  });

  // 2. Simpan ke profil Tutor (menggunakan kolom photo_url)
  await prisma.tutor.create({
    data: {
      name,
      email: cleanEmail,
      phone_wa: cleanPhone,
      education,
      location,
      price_per_hour,
      experience_years,
      bio: bio || "",
      photo_url: finalPhotoUrl,
      bank_account: bank_account,
      is_verified: false,
    },
  });

  redirect("/join?success=true");
}