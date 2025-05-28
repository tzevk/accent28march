import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'manager123';
  const hashedManagerPassword = await bcrypt.hash(password, 10);

  const userPassword = 'user123';
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);

  await prisma.user.upsert({
    where: { email: 'manager@crm.com' },
    update: {},
    create: {
      name: 'Project Manager',
      email: 'manager@crm.com',
      hashedPassword: hashedManagerPassword,
      role: 'PROJECT MANAGER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@crm.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@crm.com',
      hashedPassword: hashedUserPassword,
      role: 'USER',
    },
  });

  console.log('✅ Manager and User created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });