import mongoose from 'mongoose';
import { seedDatabase } from './seedData.js';
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedDatabase();
    }
    catch (error) {
        const err = error;
        console.error(`Database Connection Error: ${err.message}`);
        process.exit(1);
    }
};
export default connectDB;
