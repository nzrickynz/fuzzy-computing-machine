import { PrismaClient, Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Add error handling middleware
prisma.$use(async (params, next) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    console.error(`[Prisma Error] ${params.model}.${params.action} failed:`, error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('[Database] Connection configuration:', {
        url: process.env.POSTGRES_PRISMA_URL ? 'Set' : 'Not set',
        nodeEnv: process.env.NODE_ENV,
      });
    }
    throw error;
  }
});

// Cleanup function for serverless environments
export async function cleanup() {
  await prisma.$disconnect();
}

// Handle cleanup on process termination
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
} 