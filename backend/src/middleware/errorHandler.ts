// ─────────────────────────────────────────────────────────────
// middleware/errorHandler.ts — Global error handling middleware
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    errors?: string[];
}

export const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[ERROR] ${statusCode} - ${message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
        timestamp: new Date().toISOString(),
    });
};

// Helper to create typed errors
export const createError = (statusCode: number, message: string): AppError => {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    return error;
};
