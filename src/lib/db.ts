import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Explicitly handle connection lifecycle
export async function ensureConnection() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Database connection error:', error);
    await prisma.$disconnect();
    throw error;
  }
}

// Handle cleanup on exit
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Initialize connection
ensureConnection(); 