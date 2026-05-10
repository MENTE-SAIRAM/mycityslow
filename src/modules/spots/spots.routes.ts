// ─────────────────────────────────────────────────────────────
// Spots: Main routes (/api/spots)
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { spotsController } from './spots.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/trending', spotsController.trending);
router.get('/nearby', spotsController.nearby);
router.post('/submit', authenticate, spotsController.submit);

// Reviews
router.get('/:id/reviews', spotsController.getReviews);
router.post('/:id/reviews', authenticate, spotsController.addReview);

export default router;
