import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "tutors") {
      const tutors = await prisma.tutor.findMany({ orderBy: { created_at: 'desc' } });
      return NextResponse.json(tutors);
    } 
    
    if (type === "subjects") {
      const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json(subjects);
    } 
    
    if (type === "schedules") {
      const schedules = await prisma.tutorSchedule.findMany({
        include: { tutor: true },
        orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }]
      });
      return NextResponse.json(schedules);
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}