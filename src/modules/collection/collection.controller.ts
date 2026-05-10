// ─────────────────────────────────────────────────────────────
// Collection: Controller
// ─────────────────────────────────────────────────────────────
import { Response, NextFunction } from 'express';
import { collectionService } from './collection.service';
import { AuthRequest } from '../../middleware/auth';

export const collectionController = {
    /** GET /api/collection */
    async getSaved(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await collectionService.getSavedSpots(req.user!.id, page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /** POST /api/collection/:spotId */
    async save(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await collectionService.saveSpot(req.user!.id, req.params.spotId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    /** DELETE /api/collection/:spotId */
    async remove(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await collectionService.removeSpot(req.user!.id, req.params.spotId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
