import { Request, Response, NextFunction } from 'express';
import { experiencesService } from './experiences.service';
import { AuthRequest } from '../../middleware/auth';

export const experiencesController = {
    async discover(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await experiencesService.discoverExperiences({
                city: req.query.city as string,
                type: req.query.type as string,
                category: req.query.category as string,
                travelerType: req.query.travelerType as string,
                priceRange: req.query.priceRange as string,
                duration: req.query.duration as string,
                search: req.query.search as string,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await experiencesService.getExperienceById(req.params.id);
            res.json(experience);
        } catch (error) {
            next(error);
        }
    },

    async getFilters(_req: Request, res: Response, next: NextFunction) {
        try {
            const filters = await experiencesService.getFilterMetadata();
            res.json(filters);
        } catch (error) {
            next(error);
        }
    },

    async submit(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const experience = await experiencesService.submitExperience(req.user!.id, req.body);
            res.status(201).json(experience);
        } catch (error) {
            next(error);
        }
    },
};
