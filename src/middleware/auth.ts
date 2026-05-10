// ─────────────────────────────────────────────────────────────
// middleware/auth.ts — JWT authentication & admin guard
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

/**
 * Middleware: Verify JWT access token
 */
export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError(401, 'Access denied. No token provided.');
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };

        req.user = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return next(createError(401, 'Invalid token.'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(createError(401, 'Token expired.'));
        }
        next(error);
    }
};

/**
 * Middleware: Require admin role
 */
export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'admin') {
        return next(createError(403, 'Access denied. Admin privileges required.'));
    }
    next();
};

/**
 * Optional auth — attaches user if token present, but doesn't fail
 */
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'default_secret';
            const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
            req.user = decoded;
        }
    } catch {
        // Silently ignore invalid tokens for optional auth
    }
    next();
};
