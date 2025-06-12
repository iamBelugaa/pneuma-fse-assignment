import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    errorFormat: 'pretty',
    datasources: { db: { url: process.env.DATABASE_URL } },
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}

async function gracefulShutdown() {
  console.log('Closing database connection...');
  await prisma.$disconnect();
  console.log('Database connection closed.');
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', gracefulShutdown);

export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  error?: string;
}> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { healthy: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}

export default prisma;
