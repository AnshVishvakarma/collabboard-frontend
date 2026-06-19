// lib/prisma.ts
// Replace '@prisma/client' with the relative path to your generated folder
import { PrismaClient } from '@/prisma/generated/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;