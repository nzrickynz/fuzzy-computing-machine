import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
  // Use a simpler configuration that works with Vercel
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('postgres://', 'postgresql://'),
    },
  },
});

// In development, store the instance globally
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma }; 