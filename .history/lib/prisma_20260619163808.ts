import { PrismaClient } from '@prisma/client';

// Define global type
declare global {
  var prisma: PrismaClient | undefined;
}

// Create PrismaClient with explicit options
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn', 'info']
      : ['error'],
  });
};

// Use global for development to prevent multiple instances
export const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;