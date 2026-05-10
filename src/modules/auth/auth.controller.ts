// ─────────────────────────────────────────────────────────────
// Auth: Controller — request handlers
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AuthRequest } from '../../middleware/auth';

export const authController = {
    /**
     * POST /api/auth/register
     */
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/auth/login
     */
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/auth/refresh
     */
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/auth/profile
     */
    async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await authService.getProfile(req.user!.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/auth/profile
     */
    async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await authService.updateProfile(req.user!.id, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
};
