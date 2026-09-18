import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'AR Green Garden API is running smoothly with MongoDB',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
