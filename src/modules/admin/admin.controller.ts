// ─────────────────────────────────────────────────────────────
// Admin: Controller
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import { AuthRequest } from '../../middleware/auth';

export const adminController = {
    // ─── Dashboard ───────────────────────────────────────────
    async dashboard(_req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await adminService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    },

    // ─── Cities ──────────────────────────────────────────────
    async getCities(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await adminService.getAllCities(page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async createCity(req: Request, res: Response, next: NextFunction) {
        try {
            const city = await adminService.createCity(req.body);
            res.status(201).json(city);
        } catch (error) {
            next(error);
        }
    },

    async updateCity(req: Request, res: Response, next: NextFunction) {
        try {
            const city = await adminService.updateCity(req.params.id, req.body);
            res.json(city);
        } catch (error) {
            next(error);
        }
    },

    async deleteCity(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.deleteCity(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // ─── Spots ───────────────────────────────────────────────
    async getSpots(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await adminService.getAllSpots(page, limit, req.query);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async createSpot(req: Request, res: Response, next: NextFunction) {
        try {
            const spot = await adminService.createSpot(req.body);
            res.status(201).json(spot);
        } catch (error) {
            next(error);
        }
    },

    async updateSpot(req: Request, res: Response, next: NextFunction) {
        try {
            const spot = await adminService.updateSpot(req.params.id, req.body);
            res.json(spot);
        } catch (error) {
            next(error);
        }
    },

    async deleteSpot(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.deleteSpot(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async approveSpot(req: Request, res: Response, next: NextFunction) {
        try {
            const spot = await adminService.approveSpot(req.params.id);
            res.json(spot);
        } catch (error) {
            next(error);
        }
    },

    async rejectSpot(req: Request, res: Response, next: NextFunction) {
        try {
            const spot = await adminService.rejectSpot(req.params.id);
            res.json(spot);
        } catch (error) {
            next(error);
        }
    },

    // ─── Submissions ─────────────────────────────────────────
    async getSubmissions(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const status = req.query.status as string;
            const result = await adminService.getSubmissions(page, limit, status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async approveSubmission(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.approveSubmission(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async rejectSubmission(req: Request, res: Response, next: NextFunction) {
        try {
            const reviewNote = req.body.reviewNote || '';
            const result = await adminService.rejectSubmission(req.params.id, reviewNote);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // ─── Global Settings ─────────────────────────────────────
    async getSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const settings = await adminService.getGlobalSettings();
            res.json(settings);
        } catch (error) {
            next(error);
        }
    },

    async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const settings = await adminService.updateGlobalSettings(req.user!.id, req.body);
            res.json(settings);
        } catch (error) {
            next(error);
        }
    },
};
