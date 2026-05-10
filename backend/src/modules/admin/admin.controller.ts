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

    // ─── Experiences ──────────────────────────────────────────
    async getExperiences(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await adminService.getAllExperiences(page, limit, req.query);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async createExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await adminService.createExperience(req.body);
            res.status(201).json(experience);
        } catch (error) {
            next(error);
        }
    },

    async updateExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await adminService.updateExperience(req.params.id, req.body);
            res.json(experience);
        } catch (error) {
            next(error);
        }
    },

    async deleteExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.deleteExperience(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async approveExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await adminService.approveExperience(req.params.id);
            res.json(experience);
        } catch (error) {
            next(error);
        }
    },

    async rejectExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await adminService.rejectExperience(req.params.id);
            res.json(experience);
        } catch (error) {
            next(error);
        }
    },

    // ─── Stories ─────────────────────────────────────────────
    async getStories(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const status = req.query.status as string;
            const result = await adminService.getAllStories(page, limit, status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async approveStory(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.approveStory(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async rejectStory(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.rejectStory(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // ─── Curated Guides ──────────────────────────────────────
    async getGuides(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.getAllGuides();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async createGuide(req: Request, res: Response, next: NextFunction) {
        try {
            const guide = await adminService.createGuide(req.body);
            res.status(201).json(guide);
        } catch (error) {
            next(error);
        }
    },

    async updateGuide(req: Request, res: Response, next: NextFunction) {
        try {
            const guide = await adminService.updateGuide(req.params.id, req.body);
            res.json(guide);
        } catch (error) {
            next(error);
        }
    },

    async deleteGuide(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.deleteGuide(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
