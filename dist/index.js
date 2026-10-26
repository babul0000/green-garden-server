import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB, { prisma } from './db.js';
import apiRouter from './routes/api.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
// Connect to Database
connectDB();
app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowed = [CLIENT_URL, 'http://localhost:3000', 'http://localhost:3001'];
        if (allowed.includes(origin) ||
            origin.endsWith('.netlify.app') ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.onrender.com') ||
            origin.includes('localhost')) {
            return callback(null, true);
        }
        return callback(null, true); // Allow all legitimate clients
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Required for JWT cookie reading
// Prevent HTTP caching on all API responses
app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});
// API Routes
app.use('/api', apiRouter);
// Health check (always public)
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
        timestamp: new Date().toISOString(),
    });
});
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Global Error Handler (must be last)
app.use(globalErrorHandler);
app.listen(PORT, () => {
    console.log(`🌿 AR Green Garden Server running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
});
export default app;
