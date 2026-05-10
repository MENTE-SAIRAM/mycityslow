// ─────────────────────────────────────────────────────────────
// Home: Controller
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import { homeService } from './home.service';
import { AuthRequest } from '../../middleware/auth';

export const homeController = {
    /** GET /api/home */
    async getHome(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userCity = (req.query.city as string) || (req.user as any)?.city;
            const data = await homeService.getHomeData(userCity);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },
};
