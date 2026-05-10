import { Request, Response, NextFunction } from 'express';
import { citiesService } from './cities.service';

export const citiesController = {
    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const cities = await citiesService.getAllCities();
            res.json(cities);
        } catch (error) {
            next(error);
        }
    },

    async getBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const city = await citiesService.getCityBySlug(req.params.citySlug);
            res.json(city);
        } catch (error) {
            next(error);
        }
    },

    async getSlowGuide(req: Request, res: Response, next: NextFunction) {
        try {
            const guide = await citiesService.getSlowGuide(req.params.citySlug);
            res.json(guide);
        } catch (error) {
            next(error);
        }
    },
};
