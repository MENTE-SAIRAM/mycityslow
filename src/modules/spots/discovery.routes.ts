// ─────────────────────────────────────────────────────────────
// Discovery: Routes — mounted at /api/discovery/spots
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { discoveryController } from './discovery.controller';

const router = Router();

router.get('/', discoveryController.discover);
router.get('/filters', discoveryController.getFilters);
router.get('/:id', discoveryController.getById);

export default router;
