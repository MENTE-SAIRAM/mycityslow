// ─────────────────────────────────────────────────────────────
// src/server.ts — Application entry point
// ─────────────────────────────────────────────────────────────
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🌿 My City Slow API running on http://localhost:${PORT}`);
            console.log(`📦 API prefix: /api`);
            console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

start();
