import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

// Add detailed query logging
prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
  if (e.params) console.log('Params: ' + e.params);
});

// Add error handling
prisma.$use(async (params, next) => {
  const before = Date.now();
  try {
    const result = await next(params);
    const after = Date.now();
    console.log(`[Prisma] ${params.model}.${params.action} took ${after - before}ms`);
    return result;
  } catch (error) {
    console.error(`[Prisma Error] ${params.model}.${params.action} failed:`, error);
    throw error;
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

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

// Handle cleanup on exit
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Initialize connection
ensureConnection(); 