// ─────────────────────────────────────────────────────────────
// Community: Routes — coming soon stub
// ─────────────────────────────────────────────────────────────
import { Router, Request, Response } from 'express';

const router = Router();

// All community endpoints return "coming soon"
const comingSoon = (_req: Request, res: Response) => {
    res.json({
        message: 'Community feature coming soon',
        status: 'soon',
        features: [
            'Share your peaceful experiences',
            'Follow other slow explorers',
            'Group slow walks & meetups',
            'Photo stories from hidden spots',
        ],
    });
};

router.get('/', comingSoon);
router.get('/feed', comingSoon);
router.get('/stories', comingSoon);
router.post('/post', comingSoon);

export default router;
