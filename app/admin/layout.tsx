import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  console.log("--- ADMIN LAYOUT CHECK ---");
  console.log("Email dari Cookie:", userEmail);

  if (!userEmail) {
    console.log("Redirect: Tidak ada cookie, lempar ke /login");
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  console.log("Data User ditemukan di DB:", user);
  console.log("Role User:", user?.role);

  // Jika user tidak ada atau rolenya bukan ADMIN
  if (!user || user.role !== "ADMIN") {
    console.log("Redirect: Bukan ADMIN, lempar ke /dashboard");
    redirect("/dashboard");
  }

  console.log("Akses Diterima: Masuk ke panel admin.");
  return <>{children}</>;
}