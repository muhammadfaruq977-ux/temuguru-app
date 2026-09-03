import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newTutor = await prisma.tutor.create({
      data: {
        name: body.name,
        email: body.email,
        phone_wa: body.phone_wa,
        price_per_hour: Number(body.price_per_hour),
        location: body.location,
        methods: body.methods,
        education: body.education.toUpperCase(),
        is_active: true,
      }
    });

    return NextResponse.json(newTutor, { status: 201 });
  } catch (error) {
    console.error("Error creating tutor:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data guru. Pastikan email belum pernah digunakan." }, 
      { status: 500 }
    );
  }
}