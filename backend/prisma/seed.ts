import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@library.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const librarian = await prisma.user.upsert({
    where: { email: 'librarian@library.com' },
    update: {},
    create: {
      name: 'Librarian',
      email: 'librarian@library.com',
      password: await bcrypt.hash('librarian123', 10),
      role: 'LIBRARIAN',
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Tecnología' }, update: {}, create: { name: 'Tecnología' } }),
    prisma.category.upsert({ where: { name: 'Ciencias' }, update: {}, create: { name: 'Ciencias' } }),
    prisma.category.upsert({ where: { name: 'Historia' }, update: {}, create: { name: 'Historia' } }),
    prisma.category.upsert({ where: { name: 'Literatura' }, update: {}, create: { name: 'Literatura' } }),
    prisma.category.upsert({ where: { name: 'Derecho' }, update: {}, create: { name: 'Derecho' } }),
  ]);

  console.log('Seed completed:', { admin: admin.email, librarian: librarian.email, categories: categories.map((c) => c.name) });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
