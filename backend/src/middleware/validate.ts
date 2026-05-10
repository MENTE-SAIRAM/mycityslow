// ─────────────────────────────────────────────────────────────
// middleware/validate.ts — Zod validation middleware
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validates request body/query/params against a Zod schema.
 * Usage: validate(myZodSchema, 'body')
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const data = schema.parse(req[source]);
            req[source] = data; // Replace with parsed/cleaned data
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Validation failed',
                    errors: messages,
                });
                return;
            }
            next(error);
        }
    };
};
