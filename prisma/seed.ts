import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Setup Admin Account
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@temuguru.com' },
    update: {},
    create: {
      name: 'Admin TemuGuru',
      email: 'admin@temuguru.com',
      password_hash: adminPassword,
      role: 'ADMIN',
      phone: '081234567890',
    },
  });
  console.log('✅ Admin created');

  // 2. Setup Subjects
  const subjects = ['Matematika', 'Bahasa Inggris', 'Coding', 'IPA', 'IPS', 'Musik'];
  const createdSubjects = [];
  for (const sub of subjects) {
    const record = await prisma.subject.upsert({
      where: { name: sub },
      update: {},
      create: { name: sub, category: 'Akademik' },
    });
    createdSubjects.push(record);
  }
  console.log('✅ Subjects created');

  // 3. Setup Tutor Dummy (Budi Santoso)
  const mathId = createdSubjects.find((s) => s.name === 'Matematika')?.id;
  
  if (mathId) {
    const tutor1 = await prisma.tutor.upsert({
      where: { email: 'budi.santoso@tutor.dummy' },
      update: {},
      create: {
        name: 'Budi Santoso',
        email: 'budi.santoso@tutor.dummy',
        phone_wa: '08111222333',
        bio: 'Guru Matematika yang sabar dan berpengalaman mengajar anak SMP & SMA.',
        education: 'S1 Pendidikan Matematika, Universitas X',
        experience_years: 7,
        price_per_hour: 75000,
        location: 'Denpasar',
        methods: 'BOTH',
        is_verified: true,
        subjects: {
          create: [{ subject_id: mathId, level: 'SMP, SMA' }],
        },
        schedules: {
          create: [
            { day_of_week: 1, start_time: '17:00', end_time: '19:00' }, // Senin
            { day_of_week: 3, start_time: '16:00', end_time: '18:00' }, // Rabu
          ],
        },
      },
    });
    console.log('✅ Tutor Budi Santoso created');
  }

  // NOTE: Untuk production V1, Anda dapat menduplikasi blok tutor di atas 
  // untuk meng-generate 10-20 tutor lainnya.

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });