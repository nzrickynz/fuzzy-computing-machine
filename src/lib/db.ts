import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Handle cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Add error handling middleware
prisma.$use(async (params, next) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    console.error(`[Prisma Error] ${params.model}.${params.action} failed:`, error);
    // Log connection details on error (sanitized)
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('[Database] Connection configuration:', {
        url: process.env.POSTGRES_PRISMA_URL ? 'Set' : 'Not set',
        nodeEnv: process.env.NODE_ENV,
      });
    }
    throw error;
  }
});

// Enhanced connection management
export async function ensureConnection() {
  try {
    await prisma.$connect();
    console.log('[Database] Connected successfully');
  } catch (error) {
    console.error('[Database] Connection failed:', error);
    // Log additional connection details (sanitized)
    console.error('[Database] Connection URL format:', process.env.POSTGRES_PRISMA_URL?.split('@')[0].split(':')[0]);
    throw error;
  }
}

// Initialize connection
ensureConnection(); 