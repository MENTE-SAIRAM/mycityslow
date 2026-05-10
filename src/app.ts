// ─────────────────────────────────────────────────────────────
// src/app.ts — Express app setup with middleware
// ─────────────────────────────────────────────────────────────
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import cityRoutes from './modules/cities/cities.routes';
import spotRoutes from './modules/spots/spots.routes';
import discoveryRoutes from './modules/spots/discovery.routes';
import homeRoutes from './modules/home/home.routes';
import collectionRoutes from './modules/collection/collection.routes';
import communityRoutes from './modules/community/community.routes';
import searchRoutes from './modules/search/search.routes';
import uploadRoutes from './modules/upload/upload.routes';
import adminRoutes from './modules/admin/admin.routes';

// Middleware
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ─── Global Response Interceptor ────────────────────────────
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        // Prevent wrapping if it's already wrapped (success field exists) or if it's just a boolean/string
        if (body && typeof body === 'object' && ('success' in body)) {
            return originalJson.call(this, body);
        }
        return originalJson.call(this, {
            success: true,
            message: 'Success',
            data: body
        });
    };
    next();
});

// ─── Security & Parsing ─────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Rate Limiting (60 req/min) ─────────────────────────────
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ─── Static uploads folder ──────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── SEO static files for root domain ────────────────────────
app.get('/sitemap.xml', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'robots.txt'));
});

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/discovery/spots', discoveryRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'My City Slow API is running 🌿', timestamp: new Date().toISOString() });
});

// ─── 404 handler ────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

export default app;
