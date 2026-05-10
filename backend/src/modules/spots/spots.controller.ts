// ─────────────────────────────────────────────────────────────
// Spots: Controller
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import { spotsService } from './spots.service';
import { AuthRequest } from '../../middleware/auth';

export const spotsController = {
    /** GET /api/spots/trending */
    async trending(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const spots = await spotsService.getTrending(limit);
            res.json(spots);
        } catch (error) {
            next(error);
        }
    },

    /** GET /api/spots/nearby?lat=...&lng=...&radius=...&limit=... */
    async nearby(req: Request, res: Response, next: NextFunction) {
        try {
            const lat = parseFloat(req.query.lat as string);
            const lng = parseFloat(req.query.lng as string);
            const radius = parseFloat(req.query.radius as string) || 15;
            const limit = parseInt(req.query.limit as string) || 20;
            const page = parseInt(req.query.page as string) || 1;

            if (isNaN(lat) || isNaN(lng)) {
                res.status(400).json({ success: false, message: 'lat and lng are required' });
                return;
            }

            const spots = await spotsService.getNearby(lat, lng, radius, limit, page);
            res.json(spots);
        } catch (error) {
            next(error);
        }
    },

    /** POST /api/spots/submit — user submits new spot */
    async submit(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const submission = await spotsService.submitSpot(req.user!.id, req.body);
            res.status(201).json(submission);
        } catch (error) {
            next(error);
        }
    },

    /** GET /api/spots/:id/reviews */
    async getReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const reviews = await spotsService.getReviews(req.params.id, page, limit);
            res.json(reviews);
        } catch (error) {
            next(error);
        }
    },

    /** POST /api/spots/:id/reviews */
    async addReview(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const review = await spotsService.addReview(req.params.id, req.user!.id, req.body);
            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }
};
