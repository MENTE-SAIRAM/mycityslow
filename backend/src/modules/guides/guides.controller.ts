import { Request, Response, NextFunction } from 'express';
import { guidesService } from './guides.service';

export const guidesController = {
    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const guides = await guidesService.getAll();
            res.json(guides);
        } catch (error) {
            next(error);
        }
    },

    async getByCity(req: Request, res: Response, next: NextFunction) {
        try {
            const guide = await guidesService.getByCitySlug(req.params.citySlug);
            res.json(guide);
        } catch (error) {
            next(error);
        }
    },
};
