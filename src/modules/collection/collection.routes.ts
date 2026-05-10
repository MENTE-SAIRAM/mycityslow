// ─────────────────────────────────────────────────────────────
// Collection: Routes
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { collectionController } from './collection.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// All collection routes require authentication
router.use(authenticate);

router.get('/', collectionController.getSaved);
router.post('/:spotId', collectionController.save);
router.delete('/:spotId', collectionController.remove);

export default router;
