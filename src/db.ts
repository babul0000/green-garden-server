import { PrismaClient } from '../../green-garden/node_modules/@prisma/client/index.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected successfully with Prisma Client');
  } catch (error) {
    const err = error as Error;
    console.warn(`⚠️ PostgreSQL Connection notice: ${err.message}`);
  }
};

export default connectDB;
