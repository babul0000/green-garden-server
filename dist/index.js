import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { prisma } from './db.js';
import apiRouter from './routes/api.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to Database
connectDB();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
// API Routes
app.use('/api', apiRouter);
app.get('/api/health', async (_req, res) => {
    let dbStatus = 'connected';
    try {
        await prisma.$queryRaw `SELECT 1`;
    }
    catch {
        dbStatus = 'disconnected';
    }
    res.status(200).json({
        status: 'ok',
        database: 'PostgreSQL (Prisma ORM)',
        dbStatus,
        message: 'AR Green Garden API is running smoothly with PostgreSQL and Prisma ORM',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`🌿 AR Green Garden Server is running on port ${PORT} with PostgreSQL & Prisma`);
});
export default app;
