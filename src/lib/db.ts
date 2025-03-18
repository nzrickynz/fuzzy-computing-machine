import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Handle cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Add detailed query logging
prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
  if (e.params) console.log('Params: ' + e.params);
});

// Add error handling middleware
prisma.$use(async (params, next) => {
  const before = Date.now();
  try {
    const result = await next(params);
    const after = Date.now();
    console.log(`[Prisma] ${params.model}.${params.action} took ${after - before}ms`);
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
    console.error('[Database] Connection URL format:', process.env.DATABASE_URL?.split('@')[0].split(':')[0]);
    throw error;
  }
}

// Initialize connection
ensureConnection(); 