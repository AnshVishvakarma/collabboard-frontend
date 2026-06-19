// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// For Prisma v7+, the global approach is slightly different
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;