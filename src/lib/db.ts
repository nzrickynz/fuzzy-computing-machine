import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Handle cleanup on exit
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export async function connectDB() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    // Attempt to reconnect once
    try {
      await prisma.$disconnect();
      await prisma.$connect();
    } catch (retryError) {
      console.error('Failed to reconnect to the database:', retryError);
      throw retryError;
    }
  }
} 