import { Request, Response, NextFunction } from 'express';
import { localStoriesService } from './local-stories.service';
import { AuthRequest } from '../../middleware/auth';

export const localStoriesController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const city = req.query.city as string;
            const result = await localStoriesService.getAll(page, limit, city);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const story = await localStoriesService.getById(req.params.id);
            res.json(story);
        } catch (error) {
            next(error);
        }
    },

    async getBySpot(req: Request, res: Response, next: NextFunction) {
        try {
            const stories = await localStoriesService.getBySpot(req.params.spotId);
            res.json(stories);
        } catch (error) {
            next(error);
        }
    },

    async getByExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const stories = await localStoriesService.getByExperience(req.params.experienceId);
            res.json(stories);
        } catch (error) {
            next(error);
        }
    },

    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const story = await localStoriesService.create(req.user!.id, req.body);
            res.status(201).json(story);
        } catch (error) {
            next(error);
        }
    },

    async like(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await localStoriesService.like(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
