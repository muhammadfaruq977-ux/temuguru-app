"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

  const existingTutor = await prisma.tutor.findFirst({
    where: {
      OR: [
        { email: cleanEmail },
        { phone_wa: cleanPhone }
      ]
    }
  });

  if (existingTutor) {
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

  let photoUrl = null;

  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.name.split(".").pop();
      const fileName = `tutor-${uniqueSuffix}.${extension}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      photoUrl = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Gagal mengunggah foto profil guru:", error);
    }
  }

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
      photo_url: photoUrl,
      bank_account: bank_account,
      is_verified: false,
    },
  });

  redirect("/join?success=true");
}