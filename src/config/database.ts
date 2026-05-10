// ─────────────────────────────────────────────────────────────
// config/database.ts — MongoDB connection
// ─────────────────────────────────────────────────────────────
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/my-city-slow';

    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB error:', err);
    });
};
