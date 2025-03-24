import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Ensure we only create one instance
const prisma = globalThis.prisma ?? prismaClientSingleton();

// In development, store the instance globally
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma }; 