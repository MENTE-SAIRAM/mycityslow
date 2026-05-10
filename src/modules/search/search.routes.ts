// ─────────────────────────────────────────────────────────────
// Search: Routes
// ─────────────────────────────────────────────────────────────
import { Router, Request, Response, NextFunction } from 'express';
import { searchService } from './search.service';

const router = Router();

/** GET /api/search?query=...&page=1&limit=20 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await searchService.search(query, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
