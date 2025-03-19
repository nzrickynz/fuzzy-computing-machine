import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  if (!process.env.POSTGRES_PRISMA_URL) {
    throw new Error('POSTGRES_PRISMA_URL environment variable is not set');
  }

  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL
      }
    }
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// In development, we want to reuse the connection
// In production, we want to create a new connection for each request
const prisma = process.env.NODE_ENV === 'production' 
  ? prismaClientSingleton()
  : (globalThis.prisma ?? prismaClientSingleton());

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma }; 